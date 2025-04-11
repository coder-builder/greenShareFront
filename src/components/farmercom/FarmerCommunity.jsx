import { useEffect, useState } from "react";
import styles from "./FarmerCommunity.module.css";
import { useNavigate } from "react-router-dom";
import { getStories } from "../../apis/plantStory";

const FarmerCommunity = () => {
  const nav = useNavigate();

  const [getPlantStory, setGetPlantStory] = useState([]);

  useEffect(() => {
    getStories()
      .then((res) => setGetPlantStory(res.data))
      .catch((error) => console.log(error));
  }, []);

  return (
    <>
      <h2>식물 이야기</h2>

      <div className={styles.container}>
        {getPlantStory.map((story, i) => {
          return (
            <div className={styles.contentBox} key={i} onClick={()=>{nav(`/detail-community/${story.boardNum}`)}}>
              <div className={styles.imgDiv}>
                <div>이미지</div>
                <p>{story.userEmail}</p>
              </div>
              <div className={styles.titleDiv}>
                <p>{story.title}</p>
                <p>{story.content}</p>
              </div>
            </div>
          );
        })}

        <button
          type="button"
          onClick={(e) => {
            nav("/reg-community");
          }}
        >
          글쓰기
        </button>
      </div>
    </>
  );
};

export default FarmerCommunity;
