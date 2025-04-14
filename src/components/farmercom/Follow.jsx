import React, { useEffect, useState } from 'react'
import styles from './Follow.module.css'
import { axiosInstance } from '../../redux/axiosInstance';

const Follow = () => {
  const [followList, setFollowList] = useState([]);



  const getUserEmailFromToken = () => {
    const token = localStorage.getItem('accessToken');
    
    if (!token) return null;
  
    const payload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payload));
  
    return decodedPayload.sub; // 내 이메일 (JWT 구조에 맞게)
  }
  

  useEffect(() => {
    const userEmail = getUserEmailFromToken();

    axiosInstance.get('/follow', {
      params: {
        fromUserEmail: userEmail  // 내가 팔로우한 사람 조회
      }
    })
    .then((res) => {
      setFollowList(res.data);
    })
    .catch((error) => {
      console.log(error);
    })
  }, [])



// 언팔로우
const unfollow = (toUserEmail) => {
  const fromUserEmail = getUserEmailFromToken();

  axiosInstance.delete('/follow/unfollow', {
    params: {
      fromUserEmail: fromUserEmail,
      toUserEmail: toUserEmail
    }
  })
  .then(() => {
    // 언팔로우 성공시 팔로잉 목록 새로 불러오기
    axiosInstance.get('/follow', {
      params: {
        fromUserEmail: fromUserEmail
      }
    })
    .then((res) => {
      setFollowList(res.data);
    })
    .catch((error) => {
      console.log(error);
    })
  })
  .catch((error) => {
    console.log(error);
  })
}








  return (
    <div className={styles.container}>
    <h2 className={styles.title}>내가 팔로우한 목록</h2>

    <div className={styles.followList}>
      {followList.length === 0 ? (
        <p>팔로우한 사용자가 없습니다.</p>
      ) : (
        followList.map((user, i) => (
          <div key={i} className={styles.followItem}>
            
            <p className={styles.userEmail}>이메일 : {user.fromUserEmail}</p>

            <button className={styles.followBtn} onClick={()=>{unfollow(user.toUserEmail)}}>언팔로우</button>

          </div>
        ))
      )}
    </div>
  </div>
  )
}

export default Follow;
