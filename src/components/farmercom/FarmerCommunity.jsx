import React from "react";
import styles from "./FarmerCommunity.module.css";
import { useNavigate } from "react-router-dom";

const FarmerCommunity = () => {
  const nav = useNavigate()

  return (
    <>
      <h2>식물 이야기</h2>
      <div className={styles.container}>
       
        <div className={styles.imgDiv}>
          <p>이미지</p>
          <p>작성자: USER_ROLE</p>
        </div>
        
        <div className={styles.contentDiv}>
          <p>제목: title</p>
          <p>내용: content</p>
        </div>
        
        <div className={styles.likeDiv}>
          <p>좋아요 이모지 / 좋아요 갯수</p>
          <p>댓글 이모지 / 갯수</p>
        </div>

        <button type="button" onClick={(e)=>{
          nav('/reg-community')
        }}>게시글 등록</button>
      
      </div>
    </>
  );
};

export default FarmerCommunity;
