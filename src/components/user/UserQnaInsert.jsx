import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './UserQnaInsert.module.css';
import { axiosInstance } from '../../redux/axiosInstance';

const UserQnaInsert = () => {
  const nav = useNavigate();
  
    const [insertQna, setinsertQna] = useState({
      title: "",
      content: ""
    });
  
    const insertChange = (e) => {
      setinsertQna({
        ...insertQna,
        [e.target.name]: e.target.value
      });
    };
  
    // 게시글 등록기능
    const insertInfo = () => {
      if (!insertQna.title || !insertQna.content) {
        alert("제목과 내용을 모두 입력해주세요.");
        return;
      }
  
      axiosInstance.post('/qna', insertQna)
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
        <div >
          <table className={styles.mainContainer}>
            <tbody>
              <tr>
                <td>
                  제목
                </td>
                <td>
                  <input type='text' name='title' value={insertQna.title} onChange={e=>{insertChange(e)}}/>
                </td>
              </tr>
              <tr>
                <td>
                  내용
                </td>
                <td>
                  <textarea rows={7} cols={23} 
                  type='text' 
                  name='content' 
                  value={insertQna.content} onChange={e=>{insertChange(e)}}/>
                </td>
              </tr>
            </tbody>
          </table>
          <button type="button" className={styles.insert} onClick={insertInfo}>등록하기</button>
        </div>
      </>
    )
};

export default UserQnaInsert;
