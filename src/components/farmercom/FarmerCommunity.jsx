import React from "react";
import styles from "./FarmerCommunity.module.css";

const FarmerCommunity = () => {
  return (
    <>
      <h2>자유 게시판</h2>

      <div className={styles.container}>
        <div>검색</div>
        <div>게시글 목록</div>
      </div>
    </>
  );
};

export default FarmerCommunity;
