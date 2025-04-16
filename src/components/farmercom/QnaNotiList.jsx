import React, { useEffect, useState } from "react";
import styles from "./QnaNotiList.module.css";
import axios from "axios";
import dayjs from "dayjs";

const QnaNotiList = () => {

  //공지사항 5개까지 저장
  const [latest, setLatest] = useState([]);
  useEffect(() => {
    axios
      .get('/api/farmers/latest')
      .then((res) => {
        setLatest(res.data);
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  //QnA게시판 5개 까지 저장
  const[qnaList,setQnaList] =useState([]);
  useEffect(()=>{
    axios
      .get('/api/qna/qnaTest')
      .then(res=>{
        setQnaList(res.data);
        console.log(res.data);        
      })
  },[])
  return (
    <div className={styles.indexContainer}>
      <div className={styles.boardContainer}>
        <div>
          <h3>공지사항</h3>
          <table>
            {latest.map((list, i) => {
              return (
                <tr key={i}>
                  <td>{list.boardNum}</td>
                  <td>{list.title}</td>
                  <td>{dayjs(list.date).format("YYYY년 MM월 DD일")}</td>
                </tr>
              );
            })}
          </table>
        </div>
        <div>
          <table>
            {
              qnaList.map((qna,i)=>{
                return(
                  <tr key={i}>
                    <td>{qna.qnaNum}</td>
                    <td>{qna.title}</td>
                    <td>{dayjs(qna.date).format("YYYY년 MM월 DD일")}</td>
                  </tr>
                )
              })
            }
          </table>
        </div>
      </div>
    </div>
  );
};

export default QnaNotiList;
