import React, { useEffect, useState } from 'react';
import styles from './Follow.module.css';
import { axiosInstance } from '../../redux/axiosInstance';
import { useNavigate } from 'react-router-dom';

const Follow = () => {
  const nav = useNavigate();

  const [followList, setFollowList] = useState([]);
  const [postList, setPostList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);  // 선택한 사용자 상태값

  const getUserEmailFromToken = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;
    const payload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payload));
    return decodedPayload.sub;
  };

  const fetchFollowList = async (userEmail) => {
    try {
      const res = await axiosInstance.get('/follow', {
        params: { fromUserEmail: userEmail }
      });
      setFollowList(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchFollowPosts = async (userEmail) => {
    try {
      const res = await axiosInstance.get('/follow', {
        params: { fromUserEmail: userEmail }
      });
      const followedEmails = res.data.map(user => user.toUserEmail);

      const storyRes = await axiosInstance.get('/plantStories');
      const filteredStories = storyRes.data.filter(story =>
        followedEmails.includes(story.userEmail)
      );

      setPostList(filteredStories);
    } catch (error) {
      console.error(error);
    }
  };

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
      await fetchFollowPosts(userEmail);
      setSelectedUser(null);  // 언팔로우 후 전체보기
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const userEmail = getUserEmailFromToken();
    if (!userEmail) return;

    fetchFollowList(userEmail);
    fetchFollowPosts(userEmail);
  }, []);

  const filteredPosts = selectedUser
    ? postList.filter(post => post.userEmail === selectedUser)
    : [];

  return (
    <div className={styles.container}>
    <h2 className={styles.title}>내가 팔로우한 목록</h2>

    <div className={styles.contentWrapper}>
      {/* 팔로우 리스트 영역 */}
      <section className={styles.followListSection}>
        {followList.length === 0 ? (
          <p className={styles.empty}>팔로우한 사용자가 없습니다.</p>
        ) : (
          <div className={styles.followList}>
            {followList.map(user => (
              <div
                key={user.toUserEmail}
                className={styles.followItem}
                onClick={() => setSelectedUser(user.toUserEmail)}
                style={{ cursor: 'pointer' }}
              >
                <p className={styles.userEmail}>{user.toUserEmail}</p>
                <button
                  className={styles.followBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    unfollow(user.toUserEmail);
                  }}
                >
                  언팔로우
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 게시글 영역 */}
      <section className={styles.postListSection}>
        {selectedUser ? (
          <>
            <h2 className={styles.title}>선택한 사용자 게시물</h2>
            <button
              className={styles.resetBtn}
              onClick={() => setSelectedUser(null)}
            >
              접기
            </button>

            {filteredPosts.length === 0 ? (
              <p className={styles.empty}>게시물이 없습니다.</p>
            ) : (
              <div className={styles.postList}>
                {filteredPosts.map(post => (
                  <div key={post.boardNum} className={styles.postItem}>
                    <p className={styles.writer}>
                      <strong>{post.writer}</strong> {}
                    </p>
                    <p className={styles.userEmail}>
                      사용자 이메일 : {post.userEmail}
                    </p>
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
                ))}
              </div>
            )}
          </>
        ) : (
          <p className={styles.empty}>사용자를 선택해주세요.</p>
        )}
      </section>
    </div>
  </div>
  );
};

export default Follow;
