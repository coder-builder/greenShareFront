import axios from 'axios';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react'

const NotiList = () => {
  const [qnaList, setQnaList] = useState([]);
  useEffect(() => {
    axios
      .get('/api/qna/qnaTest')
      .then((res) => {
        setQnaList(res.data);
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <div>
            <h3>QnA 게시판</h3>
            <table>
              <thead>
                <tr>
                  <th>제목</th>
                  <th>작성자</th>
                  <th>작성일</th>
                </tr>
              </thead>
              <tbody>
                {qnaList.map((qna, i) => {
                  return (
                    <tr key={i}>
                      <td>[qna게시판]</td>
                      <td>{qna.title}</td>
                      <td>{dayjs(qna.date).format("YYYY년 MM월 DD일")}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

  )
}

export default NotiList