import axios from "axios";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./FarmerNoti.module.css";
import { useSelector } from "react-redux";
import { isAdmin, isAuthenticated } from "../../redux/authCheck";
import { axiosInstance } from "../../redux/axiosInstance";
import { pic } from "../../consts/pic";

const FarmerNoti = () => {
  const nav = useNavigate();
  const token = useSelector((state) => state.auth.token);

  // 자바에서 불러온 데이터를 저장할 변수
  const [list, setList] = useState([]);
  useEffect(() => {
    axiosInstance
      .get("farmers")
      .then((res) => {
        setList(res.data);
        console.log(res.data);
      })
      .catch((error) => {
        setList([]);
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
    axiosInstance
      .get(
        `farmers?selectWord=${search.selectWord}&searchLog=${search.searchLog}`
      )
      .then((res) => {
        setList(res.data);
      })
      .catch((error) => {
        error;
      });
  };
  return (
    /* 공지사항 */
    <>
      <div className={styles.container}>
        <div className={styles.banCon}>
          <img
          className={styles.banCon} src={pic.noti} alt="" />
        </div>
        <div className={styles.fuction}>
          <select
            name="selectWord"
            value={search.selectWord}
            onChange={(e) => {
              changeSearch(e);
            }}
          >
            <option value="title">제목</option>
            <option value="userEmail">작성자</option>
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
        {list.length === 0 ? (
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
              {list.map((item, i) => (
                <tr
                  key={i}
                  className={styles.list}
                  onClick={() => nav(`/noti/${item.boardNum}`)}
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
              onClick={(e) => nav("/FarmerNotiInsert")}
            >
              등록하기
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default FarmerNoti;
