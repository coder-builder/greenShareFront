import { testData } from "../../consts/TestData";
import styles from "./FarmerTestList.module.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Dashboard from "./Dashboard";

const FarmerTestList = () => {
  const list = testData; // 임시데이터

  // const [boardList,setBoardList] = useState([]);

  // 게시판 전체 조회 변수

  // useEffect(()=>{
  //   axios.get('/api/boards')
  //   .then((res)=>{
  //     setBoardList(res.data);
  //     console.log(res.data);
  //   })
  //   .catch()
  // })

  return (
    <>
      <div>목록 페이지</div>
      

      <h1>오늘의 게시글</h1>
      <div className={styles.container}>
        <div className={styles.container2}>
          {list.map((e, i) => {
            return (
              <div key={i}>
                <div className={styles.main}>
                  메인이미지
                  <Link to={"/plant"}>
                    <img src="" alt="" />
                  </Link>
                </div>

                <div className={styles.profile}>
                  <img src="/User.png" alt="" />
                  <p>{e.writer}</p>
                </div>

                <div>
                  <p>{e.content}</p>
                </div>

                <div className={styles.heart}>
                  <img src="/Heart.png" alt="" />
                  <img src="/chat.png" alt="" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default FarmerTestList;
