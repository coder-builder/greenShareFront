import { useEffect, useState } from "react";
import styles from "./FarmerCommunity.module.css";
import { Link, useNavigate } from "react-router-dom";
import { getStories } from "../../apis/plantStory";
import { axiosInstance } from "../../redux/axiosInstance";
import { isAuthenticated } from "../../redux/authCheck";

const FarmerCommunity = () => {
  const nav = useNavigate();
  const [getPlantStory, setPlantStory] = useState([]);
  const [isUpdate, setIsUpdate] = useState(0); // 좋아요 상태 업데이트를 위한 상태

  // ✅ 이메일 & 권한 상태 저장
  const [userEmail, setUserEmail] = useState(null);
  const [userRole, setUserRole] = useState(null);

  // ✅ 토큰에서 이메일, 권한 디코딩
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const base64Payload = token.split(".")[1];
        const decodedPayload = JSON.parse(atob(base64Payload));
        setUserEmail(decodedPayload.sub); // 이메일
        setUserRole(decodedPayload.role); // ROLE_ADMIN 등
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

  console.log(setPlantStory);

  const like = (boardNum) => {
    const token = localStorage.getItem("accessToken");
    if (!isAuthenticated(token)) {
      return;
    }

    axiosInstance
      .post("/plantStories/like-insert", { boardNum: boardNum })
      .then(() => {
        alert("좋아요 등록");

        // 상태 업데이트
        setIsUpdate(isUpdate + 1);
      })
      .catch((error) => {
        console.error("좋아요 등록 실패:", error);
        alert("좋아요 등록에 실패했습니다.");
      });
  };

  const deleteLike = (boardNum) => {
    const token = localStorage.getItem("accessToken");
    if (!isAuthenticated(token)) {
      return;
    }

    axiosInstance
      .delete(`/plantStories/like-delete/${boardNum}`)
      .then((res) => {
        alert("좋아요 취소되었습니다");
        // 좋아요 상태 갱신
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

    if (!token) {
      console.log("토큰 없음!");
      return null;
    }

    const payload = token.split(".")[1];
    const decodedPayload = JSON.parse(atob(payload));

    console.log("디코딩된 토큰 payload", decodedPayload);

    return decodedPayload.sub; // 여기 key 중요!!
  };


  const handleFollow = (toUserEmail) => {
    const fromUserEmail = getUserEmailFromToken();

    console.log("팔로우 요청 데이터", {
      fromUserEmail: fromUserEmail,
      toUserEmail: toUserEmail,
    });


  const handleUnFollow = (toUserEmail) => {
    const fromUserEmail = getUserEmailFromToken();

    console.log(fromUserEmail);
    console.log(toUserEmail);

    if (!fromUserEmail) {
      alert("로그인이 필요합니다.");
      return;
    }

    axiosInstance
      .delete(`/follow/unfollow`, {
        params: {
          fromUserEmail: fromUserEmail,
          toUserEmail: toUserEmail,
        },
      })
      .then(() => {
        alert("언팔로우 성공!");
        setIsUpdate(isUpdate + 1); // 상태 갱신으로 다시 리스트 불러오기
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
        fromUserEmail: fromUserEmail,
        toUserEmail: toUserEmail,
      })
      .then(() => {
        alert("팔로우 성공!");

      })
      .catch((error) => {
        console.log(error);
        alert("이미 팔로우 했습니다.");


  
  

        setIsUpdate(isUpdate + 1); // 상태 갱신으로 다시 리스트 불러오기
      })
      .catch((error) => {
        console.error("언팔로우 실패:", error);
        alert("팔로우 실패");


      });
  };

  // 모든 이미지 중 첫 번째 이미지 추출
  const getFirstImage = (content) => {
    const matches = [...content.matchAll(/<img[^>]+src=["']?([^"'>]+)["']?/g)];
    return matches.length > 0 ? matches[0][1] : null;
  };

  // 텍스트만 추출
  const getTextPreview = (content, maxLength = 50) => {
    const text = content.replace(/<[^>]+>/g, ""); // 태그 제거
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
      <h2>🌿 식물 이야기</h2>

      <div className={styles.container}>
        {getPlantStory.map((story, i) => {
          const thumbnail = getFirstImage(story.content);
          const preview = getTextPreview(story.content);

          const isMine = story.userEmail === userEmail;
          const isAdmin = userRole === "ROLE_ADMIN";

          return (
            <>
              <div
                className={styles.contentBox}
                key={i}
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
                  {/* 좋아요 & 댓글 아이콘 */}
                  <div className={styles.iconDiv}>
                    {story.isLike === "Y" ? (

                      <span
                        onClick={() => deleteLike(story.boardNum)}
                        className={styles.like}
                      >
                        <i className="bi bi-heart-fill"></i> {story.likeCnt}
                      </span>
                    ) : (
                      <span
                        onClick={() => like(story.boardNum)}
                        className={styles.like}
                      >
                        <i className="bi bi-heart"></i>
                      </span>
                    )}

                    <span
                      className={styles.reply}
                      onClick={() => nav(`/detail-community/${story.boardNum}`)}
                    >
                      <img src="/chat.png" alt="댓글" />
                      {story.replyCnt}
                    </span>
                  </div>

                  {/* 유저 프로필 */}
                  <div className={styles.userDiv}>
                    <img
                      src="/User.png"
                      alt="작성자"
                      onClick={() => handleFollow(story.userEmail)}
                    />

                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteLike(story.boardNum);
                      }}
                      className={styles.like}
                    >
                      <i className="bi bi-heart-fill"></i>
                      <span>{story.likeCnt}</span>
                    </div>
                    ) : (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        like(story.boardNum);
                      }}
                      className={styles.like}
                    >
                      <i className="bi bi-heart"></i>
                      <span>{story.likeCnt}</span>
                    </div>
                  )}

                    <div
                      className={styles.reply}
                      onClick={() => nav(`/detail-community/${story.boardNum}`)}
                    >
                      <i class="bi bi-chat-left-dots"></i>
                      <span>{story.replyCnt}</span>
                    </div>

                    {/* 로그인한 사람과 게시글 작성자가 같으면 follow 글자 안보임 */}
                    {getUserEmailFromToken() !== story.userEmail && (
                      <div className={styles.userDiv}>

                      {
                        story.isFollow === 'Y'
                        ?
                        <>
                          <div className={styles.follow} onClick={(e)=>{
                            e.stopPropagation();
                            handleUnFollow(story.userEmail);
                          }} >Following</div>
                        </>
                        :
                        <>
                          <div className={styles.unfollow} onClick={(e)=>{
                            e.stopPropagation();
                            handleFollow(story.userEmail);
                          }} >Follow</div>
                        </>                       
                      } 
                      </div>
                    }                   
                  </div>                 
                </div>
              </div>             

                        {story.isFollow === "Y" ? (
                          <>
                            <div
                              className={styles.follow}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUnFollow(story.userEmail);
                              }}
                            >
                              Following
                            </div>
                          </>
                        ) : (
                          <>
                            <div
                              className={styles.unfollow}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleFollow(story.userEmail);
                              }}
                            >
                              Follow
                            </div>
                          </>
                        )}
                      </div>
                    )}

                  </div>
                </div>
              </div>

            </>
          );
        })}
      </div>

      <div>
        <button type="button" onClick={handleWriteClick}>
          글쓰기
        </button>
      </div>
    </>
  );
};



export default FarmerCommunity;
