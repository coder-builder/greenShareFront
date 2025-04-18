import { useEffect, useState } from "react";
import styles from "./FarmerCommunity.module.css";
import { useNavigate } from "react-router-dom";
import { getStories } from "../../apis/plantStory";
import { axiosInstance } from "../../redux/axiosinstance";
import { isAuthenticated } from "../../redux/authCheck";
import { pic } from "../../consts/pic";

const FarmerCommunity = () => {
  const nav = useNavigate();
  const [getPlantStory, setPlantStory] = useState([]);
  const [isUpdate, setIsUpdate] = useState(0);
  const [likeLoading, setLikeLoading] = useState({});

  const [userEmail, setUserEmail] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const base64Payload = token.split(".")[1];
        const decodedPayload = JSON.parse(atob(base64Payload));
        setUserEmail(decodedPayload.sub);
        setUserRole(decodedPayload.role);
      } catch (e) {
        console.error("토큰 디코딩 실패", e);
      }
    }
  }, []);

  useEffect(() => {
    getStories()
      .then((res) => setPlantStory(res.data))
      .catch((error) => console.log(error));
  }, [isUpdate]);

  const like = (boardNum) => {
    const token = localStorage.getItem("accessToken");
    if (!isAuthenticated(token)) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (likeLoading[boardNum]) return;

    setLikeLoading((prev) => ({ ...prev, [boardNum]: true }));

    axiosInstance
      .post("/plantStories/like-insert", { boardNum })
      .then(() => {
        setPlantStory((prevStories) =>
          prevStories.map((story) =>
            story.boardNum === boardNum
              ? { ...story, isLike: "Y", likeCnt: story.likeCnt + 1 }
              : story
          )
        );
      })
      .catch((error) => {
        console.error("좋아요 등록 실패:", error);
        alert("이미 좋아요를 눌렀거나 오류가 발생했습니다.");
      })
      .finally(() => {
        setLikeLoading((prev) => ({ ...prev, [boardNum]: false }));
      });
  };

  const deleteLike = (boardNum) => {
    const token = localStorage.getItem("accessToken");
    if (!isAuthenticated(token)) {
      return;
    }

    axiosInstance
      .delete(`/plantStories/like-delete/${boardNum}`)
      .then(() => {
        alert("좋아요 취소되었습니다");
        setPlantStory((prevStories) =>
          prevStories.map((story) =>
            story.boardNum === boardNum
              ? { ...story, isLike: "N", likeCount: story.likeCount - 1 }
              : story
          )
        );
      })
      .catch((error) => {
        console.error("좋아요 취소 실패:", error);
        alert("좋아요 취소 실패");
      });
  };

  const getUserEmailFromToken = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;
    const payload = token.split(".")[1];
    const decodedPayload = JSON.parse(atob(payload));
    return decodedPayload.sub;
  };

  const handleUnFollow = (toUserEmail) => {
    const fromUserEmail = getUserEmailFromToken();
    if (!fromUserEmail) {
      alert("로그인이 필요합니다.");
      return;
    }

    axiosInstance
      .delete(`/follow/unfollow`, {
        params: {
          fromUserEmail,
          toUserEmail,
        },
      })
      .then(() => {
        alert("언팔로우 성공!");
        setIsUpdate(isUpdate + 1);
      })
      .catch((error) => {
        console.error("언팔로우 실패:", error);
        alert("언팔로우 실패");
      });
  };

  const handleFollow = (toUserEmail) => {
    const fromUserEmail = getUserEmailFromToken();
    if (!fromUserEmail) {
      alert("로그인이 필요합니다.");
      return;
    }

    axiosInstance
      .post(`/follow/insert`, {
        fromUserEmail,
        toUserEmail,
      })
      .then(() => {
        alert("팔로우 성공!");
      })
      .catch((error) => {
        console.log(error);
        alert("이미 팔로우 했습니다.");
        setIsUpdate(isUpdate + 1);
      });
  };


  

  // 모든 이미지 중 첫 번째 이미지 추출


  const getFirstImage = (content) => {
    const matches = [...content.matchAll(/<img[^>]+src=["']?([^"'>]+)["']?/g)];
    return matches.length > 0 ? matches[0][1] : null;
  };

  const getTextPreview = (content, maxLength = 50) => {
    const text = content.replace(/<[^>]+>/g, "");
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const handleWriteClick = () => {
    if (!userEmail) {
      alert("회원가입 후 이용해주세요.");
      return;
    }
    nav("/reg-community");
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.container}>
          <img className={styles.width100} src={pic.com} alt="" />
        </div>
        {getPlantStory.map((story) => {
          const thumbnail = getFirstImage(story.content);
          const preview = getTextPreview(story.content);
          const isMine = story.userEmail === userEmail;
          const isAdmin = userRole === "ROLE_ADMIN";

          return (
            <div
              key={story.boardNum}
              className={styles.contentBox}
              onClick={() => nav(`/detail-community/${story.boardNum}`)}
            >
              <div className={styles.imgDiv}>
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt="썸네일"
                    className={styles.thumbnail}
                  />
                ) : (
                  <div className={styles.noImage}>이미지 없음</div>
                )}
                <p className={styles.user}>
                  {story.userEmail}
                  {(isMine || isAdmin) && " (내 글)"}
                </p>
              </div>

              <div className={styles.titleDiv}>
                <p className={styles.title}>{story.title}</p>
                <p className={styles.preview}>{preview}</p>
              </div>

              <div className={styles.infoDiv}>
                <div className={styles.iconDiv}>
                  {story.isLike === "Y" ? (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteLike(story.boardNum);
                      }}
                      className={styles.like}
                    >
                      <i className="bi bi-heart-fill"></i> {story.likeCnt}
                    </span>
                  ) : (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!likeLoading[story.boardNum]) {
                          like(story.boardNum);
                        }
                      }}
                      className={styles.like}
                    >
                      <i className="bi bi-heart"></i> {story.likeCnt}
                    </span>
                  )}

                  <span
                    className={styles.reply}
                    onClick={(e) => {
                      e.stopPropagation();
                      nav(`/detail-community/${story.boardNum}`);
                    }}
                  >
                    <i className="bi bi-chat-left-dots"></i>
                    {story.replyCnt}
                  </span>
                </div>

                <div className={styles.userDiv}>
                  {getUserEmailFromToken() !== story.userEmail && (
                    <div className={styles.userDiv}>
                      {story.isFollow === "Y" ? (
                        <div
                          className={styles.follow}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUnFollow(story.userEmail);
                          }}
                        >
                          Following
                        </div>
                      ) : (
                        <div
                          className={styles.unfollow}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFollow(story.userEmail);
                          }}
                        >
                          Follow
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div>
        <button className={styles.df} type="button" onClick={handleWriteClick}>
          글쓰기
        </button>
      </div>
    </>
  );
};

export default FarmerCommunity;
