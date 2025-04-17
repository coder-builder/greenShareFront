import axios from 'axios';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs'; // dayjs import 추가

const QnaList = () => {
  // 공지사항 5개까지 저장
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


  return (
    <div>
      <div>
        <h3>공지사항</h3>
        <table>
          <thead>
            <tr>
              <th>[공지]</th>
              <th>제목</th>
              <th>작성일</th>
            </tr>
          </thead>
          <tbody>
            {latest.map((list, i) => {
              return (
                <tr key={i}>
                  <td>[공지]</td>
                  <td>{list.title}</td>
                  <td>{dayjs(list.date).format("YYYY년 MM월 DD일")}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default QnaList;
