import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { detailStory } from "../../apis/plantStory";
import styles from "./FamerCommunityDetail.module.css";
import dayjs from "dayjs";

const FarmerCommunityDetail = () => {
  const { boardNum } = useParams();

  const [storyDetail, setStoryDetail] = useState({});

  useEffect(() => {
    detailStory(boardNum)
      .then((res) => setStoryDetail(res.data))
      .catch((error) => console.log(error));
  }, [boardNum]);

  return (
    <>
      <div className={styles.container}>
       
        <div className={styles.header}>
          <p>{storyDetail.userEmail}</p>
          <p>팔로우</p>
        </div>

        <div className={styles.titleDiv}>
          <h2>{storyDetail.title}</h2>
          <div className={styles.likeDiv}>
            <p>{dayjs(storyDetail.regDate).format('YYYY-MM-DD')}</p>
            <p>조회수: {storyDetail.readCnt}</p>
            <p>좋아요 누르기</p>
          </div>
        </div>
        
        <div className={styles.contentDiv}>
          <p>{storyDetail.content}</p>
          <p>이미지</p>
        </div>

        <div className={styles.replyDiv}>댓글영역</div>
      </div>
    </>
  );
};

export default FarmerCommunityDetail;
