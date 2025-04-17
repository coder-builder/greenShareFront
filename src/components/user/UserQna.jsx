import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import styles from "./UserQna.module.css";
import axios from "axios";
import { useSelector } from "react-redux";
import { isAdmin } from "../../redux/authCheck";

const UserQna = () => {
  const nav = useNavigate();
  const token = useSelector(state => state.auth.token);
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
      /* 공지사항 */
      <>
        <div className={styles.container}>
          <h1>QnA</h1>
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
          {/* 게시글이 없을 때 */}
          {qnaList.length === 0 ? (
            <div className={styles.noData}>게시글이 없습니다.</div>
          ) : (
            <table className={styles.table}>
              <colgroup>
                <col width={"10%"} />
                <col width={"38%"} />
                <col width={"5%"} />
                <col width={"5%"} />
                <col width={"10%"} />
              </colgroup>
              <tbody>
                <tr className={styles.header}>
                  <td>번호</td>
                  <td className={styles.title}>제목</td>
                  <td>작성자</td>
                  <td>조회수</td>
                  <td className={styles.date}>날짜</td>
                </tr>
                {qnaList.map((item, i) => (
                  <tr
                    key={i}
                    className={styles.list}
                    onClick={() => nav(`/qna/${item.qnaNum}`)}
                  >
                    <td>{item.boardNum}</td>
                    <td className={styles.mapTitle}>{item.title}</td>
                    <td>{item.userEmail}</td>
                    <td>{item.views}</td>
                    <td className={styles.insertDate}>
                      {dayjs(item.date).format("YYYY년 MM월 DD일")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {isAdmin(token) && (
            <div className={styles.secondBtn}>
              <button
                type="button"
                className={styles.insertBtn}
                onClick={(e) => nav("/UserQnaInsert")}
              >
                등록하기
              </button>
            </div>
          )}
        </div>
      </>
    );
};

export default UserQna;
