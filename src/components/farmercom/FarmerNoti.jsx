import axios from "axios";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./FarmerNoti.module.css";

const FarmerNoti = () => {
  const nav = useNavigate();
  const [list, setList] = useState([]);

  useEffect(() => {
    axios
      .get("/api/farmers", {
        headers: {
          Authorization: localStorage.getItem("token") || "",
        },
      })
      .then((res) => {
        setList(res.data);
        console.log(res.data);
      })
      .catch((error) => {
        setList([]);
        console.log(error);
      });
  }, []);

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

  const searchList = () => {
    axios
      .get(
        `/api/farmers?selectWord=${search.selectWord}&searchLog=${search.searchLog}`,
        {
          headers: {
            Authorization: localStorage.getItem("token") || "",
          },
        }
      )
      .then((res) => {
        setList(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className={styles.container}>
      <h1>공지사항</h1>
      <div className={styles.fuction}>
        <select
          name="selectWord"
          value={search.selectWord}
          onChange={changeSearch}
        >
          <option value="title">제목</option>
          <option value="writer">작성자</option>
        </select>
        <input
          type="text"
          name="searchLog"
          value={search.searchLog}
          onChange={changeSearch}
        />
        <button
          type="button"
          className={styles.firstBtn}
          onClick={searchList}
        >
          검색
        </button>
      </div>

      {/* 게시글이 없을 때 */}
      {list.length === 0 ? (
        <div className={styles.noData}>게시글이 없습니다.</div>
      ) : (
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
              <td>작성자</td>
              <td>조회수</td>
              <td className={styles.date}>날짜</td>
            </tr>
            {list.map((item, i) => (
              <tr
                key={i}
                className={styles.list}
                onClick={() => nav(`/noti/${item.boardNum}`)}
              >
                <td>{item.boardNum}</td>
                <td className={styles.mapTitle}>{item.title}</td>
                <td>{item.writer}</td>
                <td>{item.views}</td>
                <td className={styles.insertDate}>
                  {dayjs(item.date).format("YYYY년 MM월 DD일")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className={styles.secondBtn}>
        <button
          type="button"
          className={styles.insertBtn}
          onClick={() => nav("/FarmerNotiInsert")}
        >
          등록하기
        </button>
      </div>
    </div>
  );
};

export default FarmerNoti;
