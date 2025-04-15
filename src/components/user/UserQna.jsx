import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import styles from "./UserQna.module.css";
import axios from "axios";

const UserQna = () => {
  const nav = useNavigate();

  // (qna게시판)자바에서 불러온 데이터를 저장할 변수
  const [qnaList, setQnaList] = useState([]);
  useEffect(() => {
    axios
      .get("/api/qna")
      .then((res) => {
        setQnaList(res.data);
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // 선택창,검색창 데이터를 저장할 변수
  const [search, setSearch] = useState({
    selectWord: "title",
    searchLog: "",
  });
  const changeSearch = (e) => {
    setSearch({
      ...search,
      [e.target.name]: e.target.value,
    });
  };

  //찾기 버튼
  const searchList = () => {
    axios
      .get(
        `/api/qna?selectWord=${search.selectWord}&searchLog=${search.searchLog}`
      )
      .then((res) => {
        setQnaList(res.data);
      })
      .catch((error) => {
        error;
      });
  };
  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.mainTitle}>QnA게시판</h1>
        <div className={styles.fuction}>
                  <select
                    name="selectWord"
                    value={search.selectWord}
                    onChange={(e) => {
                      changeSearch(e);
                    }}
                  >
                    <option value="title">제목</option>
                    <option value="writer">작성자</option>
                  </select>
                  <input
                    type="text"
                    name="searchLog"
                    value={search.searchLog}
                    onChange={(e) => {
                      changeSearch(e);
                    }}
                  />
                  <button
                    type="button"
                    className={styles.firstBtn}
                    onClick={(e) => {
                      searchList();
                    }}
                  >
                    검색
                  </button>
                </div>
        <table className={styles.table}>
          <colgroup>
            <col width={"10"} />
            <col width={"50%"} />
            <col width={"20%"} />
            <col width={"8%"} />
            <col width={"12%"} />
          </colgroup>
          <tbody>
            <tr className={styles.header}>
              <td>번호</td>
              <td className={styles.title}>제목</td>
              <td>진행상태</td>
              <td>작성자</td>
              <td className={styles.date}>날짜</td>
            </tr>
            {qnaList.map((qna, i) => {
              return (
                <tr
                  key={i}
                  className={styles.mapTitle}
                  onClick={(e) => {
                    nav(`/qna/${qna.qnaNum}`);
                  }}
                >
                  <td>{qna.qnaNum}</td>
                  <td>{qna.title}</td>
                  <td>{qna.status}</td>
                  <td>{qna.writer}</td>
                  <td className={styles.insertDate}>
                    {dayjs(qna.date).format("YYYY년 MM월 DD일")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className={styles.secondBtn}>
          <button
            type="button"
            className={styles.insertBtn}
            onClick={(e) => nav('/UserQnaInsert')}
          >
            등록하기
          </button>
        </div>
      </div>
    </>
  );
};

export default UserQna;
