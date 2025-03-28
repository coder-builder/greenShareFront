import React, { useState } from "react";
import styles from "./List.module.css";
import { icon } from "../../consts/icons";
import { pic } from "../../consts/pic";
import FarmerTestList from "./FarmerTestList";
import Dashboard from "./Dashboard";

const FarmerPlantList = () => {
  const [plantList, setList] = useState();

  return (
    /* 식물 목록페이지 */

    <div className={styles.mainCon}>
      <div>나의 농작물</div>

      <div className={styles.subCon}>
        <span>총 몇개</span>
        <span>작물 등록 &gt; </span>
      </div>
      <div className={styles.subCon}>
        {/* 리스트 맵 돌릴것 */}
        <div className={styles.infoCon}>
          <div className={styles.picCon}>
            <img src={pic.potato} /> {/* 맵.이미지 */}
          </div>
          <div className={styles.textCon}>
            <span
              className={[
                styles.green,
                styles.fontBold,
                styles.font15rem,
                styles.letterSpace2,
              ].join(" ")}
            >
              감자{/* 맵.작물이름 */}
            </span>
            <span className={styles.grey}>potato{/* 맵.영어이름 */}</span>
            <span className={styles.textBox}>상태가 양호합니다.</span>
            <div
              className={[styles.flexJustSpace, styles.maginTop10].join(" ")}
            >
              <span>df</span>
              <span className={[styles.grey, styles.font08rem].join(" ")}>
                디비에서 받아온 날짜 시간 {/* 맵.디비에서 받아온 시간 */}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerPlantList;
