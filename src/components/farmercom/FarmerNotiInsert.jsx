import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import styles from "./FarmerNotiInsert.module.css";
import { axiosInstance } from '../../redux/axiosInstance';

const FarmerNotiInsert = () => {
  const nav = useNavigate();

  const [insertNoti, setInsertNoti] = useState({
    title: "",
    content: ""
  });

  const insertChange = (e) => {
    setInsertNoti({
      ...insertNoti,
      [e.target.name]: e.target.value
    });
  };

  // 게시글 등록기능
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
    <>
      <div>
        <table className={styles.mainContainer}>
          <tbody>
            <tr>
              <td>제목</td>
              <td>
                <input
                  type='text'
                  name='title'
                  value={insertNoti.title}
                  onChange={insertChange}
                />
              </td>
            </tr>
            <tr>
              <td>내용</td>
              <td>
                <textarea
                  rows={7}
                  cols={23}
                  name='content'
                  value={insertNoti.content}
                  onChange={insertChange}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <button
          type="button"
          className={styles.insert}
          onClick={insertFarmers}
        >
          등록하기
        </button>
      </div>
    </>
  );
};

export default FarmerNotiInsert;
