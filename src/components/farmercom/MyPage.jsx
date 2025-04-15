
import React from 'react'
import { Link } from 'react-router-dom'
import styles from './MyPage.module.css'
import Follow from './Follow'


const MyPage = () => {
  return (
    <>

      <h1 className={styles.container}>팔로우</h1>

      
      <Follow />

      <h1>마이 페이지</h1>

      <Link to={"/follow"}>
        <p>팔로우</p>
      </Link>

    </>
  );
};


export default MyPage;

