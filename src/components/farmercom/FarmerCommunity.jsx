import { useEffect, useState } from "react";
import styles from "./FarmerCommunity.module.css";
import { Link, useNavigate } from "react-router-dom";
import { getStories } from "../../apis/plantStory";
import axios from "axios";
import { axiosInstance } from "../../redux/axiosInstance";
import { isAuthenticated } from "../../redux/authCheck";

const FarmerCommunity = () => {
  const nav = useNavigate();

  const [plantStories, setPlantStories] = useState([]);
  const [isUpdate, setIsUpdate] = useState(0)

  useEffect(() => {
    getStories()
      .then((res) => setPlantStories(res.data))
      .catch((error) => console.log(error));
  }, [isUpdate]);

  console.log(plantStories);

  const like = (boardNum) => {
    const token = localStorage.getItem('accessToken');
    if(!isAuthenticated(token)){
      return ;
    }

console.log(isUpdate);



    axiosInstance.post('/plantStories/like-insert', { boardNum: boardNum })
      .then(() => {
        alert('좋아요 등록');
  
        // 상태 업데이트
        setIsUpdate(isUpdate + 1);
      })
      .catch((error) => {
        console.error('좋아요 등록 실패:', error);
        alert('좋아요 등록에 실패했습니다.');
      });
  };
  
  
  
  const deleteLike = (boardNum) => {
    const token = localStorage.getItem('accessToken');
    if(!isAuthenticated(token)){
      return ;
    }

    axiosInstance.delete(`/plantStories/like-delete/${boardNum}`)
    .then((res) => {
        alert('좋아요 취소되었습니다');
        // 좋아요 상태 갱신
        setPlantStories((prevStories) =>
          prevStories.map((story) =>
            story.boardNum === boardNum
              ? { ...story, isLike: 'N', likeCount: story.likeCount - 1 }
              : story
          )
        );
      })
      .catch((error) => {
        console.error('좋아요 취소 실패:', error);
        alert('좋아요 취소 실패');
      });
  }
  


  const getUserEmailFromToken = () => {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      console.log("토큰 없음!");
      return null;
    }
  
    const payload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payload));
  
    console.log("디코딩된 토큰 payload", decodedPayload);
  
    return decodedPayload.sub;  // 여기 key 중요!!
  }
  
  


  const handleFollow = (toUserEmail) => {
    const fromUserEmail = getUserEmailFromToken();
  
    console.log("팔로우 요청 데이터", {
      fromUserEmail: fromUserEmail,
      toUserEmail: toUserEmail
    });
  
    if (!fromUserEmail) {
      alert('로그인이 필요합니다.');
      return;
    }
  
    axiosInstance.post('/follow/insert', {
      fromUserEmail: fromUserEmail,
      toUserEmail: toUserEmail
    })
    .then(() => {
      alert('팔로우 성공!');
    })
    .catch((error) => {
      console.log(error);
      alert('이미 팔로우 했거나 오류 발생');
    });
  }
  
  
  
  
  



  return (
    <>
      <h2>식물 이야기</h2>

      <div className={styles.container}>
        {plantStories.map((story) => (
          <div
            className={styles.contentBox}
            key={story.boardNum}
            
          >
            <div className={styles.imgDiv}>
              {story.imgUrl ? (
                <img src={story.imgUrl} alt="식물 이미지" />
              ) : (
                <div>이미지</div>
              )}
              <p>{story.userEmail}</p>
            </div>

            <div className={styles.titleDiv}>
              <p>{story.title}</p>
              <p>{story.content}</p>

              <div className={styles.infoDiv}>
                {/* 좋아요 & 댓글 아이콘 */}
                <div className={styles.iconDiv}>
                  {
                    story.isLike === 'Y'
                      ? (
                        <span onClick={() => deleteLike(story.boardNum)} className={styles.like}>
                          <i className="bi bi-heart-fill"></i> {story.likeCnt}
                        </span>
                      )
                      : (
                        <span onClick={() => like(story.boardNum)} className={styles.like}>
                          <i className="bi bi-heart"></i>
                        </span>
                      )
                  }

                  <span className={styles.reply} onClick={() => nav(`/detail-community/${story.boardNum}`)}>
                    <img src="/chat.png" alt="댓글" />
                    {story.replyCnt}
                  </span>
                </div>

                {/* 유저 프로필 */}
                <div className={styles.userDiv}>
                  <img src="/User.png" alt="작성자" onClick={() => handleFollow(story.userEmail)} />
                </div>
              </div>



            </div>
          </div>
        ))}
      </div>

      <div>
        <button type="button" onClick={() => nav("/reg-community")}>
          글쓰기
        </button>
      </div>
    </>
  );
};

export default FarmerCommunity;
