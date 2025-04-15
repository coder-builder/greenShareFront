import React, { useEffect, useState } from 'react'
import styles from './Follow.module.css'
import { axiosInstance } from '../../redux/axiosInstance';
import { detailStory } from '../../apis/plantStory';
import { useNavigate } from 'react-router-dom';

const Follow = () => {
  const nav = useNavigate();

  const [followList, setFollowList] = useState([]);
  const [postList, setPostList] = useState([]);

  // 토큰에서 이메일 추출
  const getUserEmailFromToken = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;
    const payload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payload));
    return decodedPayload.sub;
  }

  // 팔로우 리스트 조회
  const fetchFollowList = async (userEmail) => {
    try {
      const res = await axiosInstance.get('/follow', {
        params: { fromUserEmail: userEmail }
      });
      setFollowList(res.data);
    } catch (error) {
      console.error(error);
    }
  }

  // 팔로우한 사람 게시글 조회
  const fetchFollowPosts = async (userEmail) => {
    try {
      // 1. 내가 팔로우한 사람 이메일 가져오기
      const res = await axiosInstance.get('/follow', {
        params: { fromUserEmail: userEmail }
      });
  
      const followedEmails = res.data.map(user => user.toUserEmail);
  
      if (followedEmails.length === 0) {
        setPostList([]); // 게시물 초기화
        return;
      }
  
      // 2. 전체 게시글 가져오기
      const storyRes = await axiosInstance.get('/plantStories');
  
      // 3. 내가 팔로우한 사람 게시글만 필터링
      const filteredStories = storyRes.data.filter(
        (story) => followedEmails.includes(story.userEmail)
      );
  
      setPostList(filteredStories);
    } catch (error) {
      console.error(error);
    }
  }
  
  

  // 언팔로우
  const unfollow = async (toUserEmail) => {
    const userEmail = getUserEmailFromToken();
    try {
      await axiosInstance.delete('/follow/unfollow', {
        params: {
          fromUserEmail: userEmail,
          toUserEmail: toUserEmail
        }
      });
      await fetchFollowList(userEmail);
    } catch (error) {
      console.error(error);
    }
  }

  // 초기 데이터 로드
  useEffect(() => {
    const userEmail = getUserEmailFromToken();
    if (!userEmail) return;

    fetchFollowList(userEmail);
    fetchFollowPosts(userEmail);
  }, []);

  return (
    <div className={styles.container}>
      {/* 제목 */}
      <h2 className={styles.title}>내가 팔로우한 목록</h2>

        {/* 팔로우 리스트 */}
        <section className={styles.followListSection}>
          {followList.length === 0 ? (
            <p className={styles.empty}>팔로우한 사용자가 없습니다.</p>
          ) : (
            <div className={styles.followList}>
              {followList.map(user => (
                <div key={user.toUserEmail} className={styles.followItem}>
                  <p className={styles.userEmail}>이메일 : {user.fromUserEmail}</p>
                  <button
                    className={styles.followBtn}
                    onClick={() => unfollow(user.toUserEmail)}
                  >
                    언팔로우
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

          {/* 게시물 리스트 */}
<section className={styles.postListSection}>
  <h2 className={styles.title}>팔로우한 사람들의 게시물</h2>

  {postList.length === 0 ? (
    <p className={styles.empty}>게시물이 없습니다.</p>
  ) : (
    <div className={styles.postList}>
      {postList.map(post => {
        // followList 에서 해당 게시글 작성자 정보 찾기
        const followUser = followList.find(user => user.toUserEmail === post.userEmail);

        return (
          <div key={post.boardNum} className={styles.postItem}>
            <p className={styles.writer}>
              <strong>{post.writer}</strong> 님의 STORY
            </p>

            {/* 내가 팔로우한 사람 이메일 보여주기 */}
            {followUser && (
              <p className={styles.userEmail}>
                팔로우한 사람 : {followUser.fromUserEmail}
              </p>
            )}

              <p 
                className={styles.titleOnly}
                onClick={() => nav(`/detail-community/${post.boardNum}`)}
                style={{ cursor: 'pointer' }}  
              >
                제목 : {post.title}
              </p>


            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt="식물 이미지"
                className={styles.postImage}
              />
            )}
          </div>
        )
      })}
    </div>
  )}
</section>

</div>

  )
}

export default Follow;
