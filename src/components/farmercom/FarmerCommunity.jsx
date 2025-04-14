import { useEffect, useState } from "react";
import styles from "./FarmerCommunity.module.css";
import { useNavigate } from "react-router-dom";
import { getStories } from "../../apis/plantStory";

const FarmerCommunity = () => {
  const nav = useNavigate();
  const [getPlantStory, setGetPlantStory] = useState([]);

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
        setUserEmail(decodedPayload.sub);  // 이메일
        setUserRole(decodedPayload.role);  // ROLE_ADMIN 등
      } catch (e) {
        console.error("토큰 디코딩 실패", e);
      }
    }
  }, []);

  useEffect(() => {
    getStories()
      .then((res) => setGetPlantStory(res.data))
      .catch((error) => console.log(error));
  }, []);

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
            <div
              className={styles.contentBox}
              key={i}
              onClick={() => nav(`/detail-community/${story.boardNum}`)}
            >
              <div className={styles.imgDiv}>
                {thumbnail ? (
                  <img src={thumbnail} alt="썸네일" className={styles.thumbnail} />
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
            </div>
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
