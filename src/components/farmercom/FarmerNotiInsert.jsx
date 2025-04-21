import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './FarmerNotiInsert.module.css';
import { axiosInstance } from '../../redux/axiosInstance';

const FarmerNotiInsert = () => {
  const nav = useNavigate();
  const [insertNoti, setInsertNoti] = useState({
    title: '',
    content: ''
  });

  const insertChange = (e) => {
    setInsertNoti({
      ...insertNoti,
      [e.target.name]: e.target.value
    });
  };

  // 게시글 등록 기능
  const insertFarmers = () => {
    if (!insertNoti.title || !insertNoti.content) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    axiosInstance.post('/farmers', insertNoti)
    .then((res) => {
      alert('등록성공!');
      nav('/noti');
    })
    .catch((error) => {
      console.log(error);
      alert("등록에 실패했습니다.");
    });
};

  return (
    <div className={styles.container}>
      <div className={styles.subContainer}>
        <h2 className={styles.header}>공지사항 등록</h2>

        <div className={styles.titleContainer}>
          <div className={styles.title}>제목</div>
          <input
            type="text"
            name="title"
            value={insertNoti.title}
            onChange={insertChange}
            className={styles.input}
            placeholder="제목을 입력하세요"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>내용</label>
          <textarea
            name="content"
            value={insertNoti.content}
            onChange={insertChange}
            className={styles.textarea}
            placeholder="내용을 입력하세요"
            rows={8}
          />
        </div>

        <button className={styles.submitBtn} onClick={insertFarmers}>
          등록하기
        </button>
      </div>
    </div>
  );
};

export default FarmerNotiInsert;
