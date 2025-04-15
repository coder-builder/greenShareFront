import React, { useEffect, useState } from "react";
import styles from "./List.module.css";
import { icon } from "../../consts/icons";
import { pic } from "../../consts/pic";
import FarmerTestList from "./FarmerTestList";

import { getCropStandardsList } from "../../apis/envApi";
import { IMAGE_PATH } from "../../consts/upload";
import { Link, useNavigate } from "react-router-dom";

const FarmerPlantList = () => {
  const [cropList, setCropList] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    getCropStandardsList()
      .then((res) => setCropList(res.data))
      .catch((e) => console.log(e));
  }, []);
  console.log(cropList);

  console.log(cropList);
  return (
    /* 식물 목록페이지 */

    <div className={styles.mainCon}>
      <div>나의 농작물</div>

      <div className={styles.subCon}>
        {/* */}
        {cropList.map((crop, i) => {
          return (
            <div
              onClick={() => {
                /* 클릭시 작물 디테일로  */
                nav(`/plant/${cropList[i].id}`);
              }}
              className={[styles.infoCon, styles.cursor].join(" ")}
              key={i}
            >
              <div className={styles.picCon}>
                <img src={`${IMAGE_PATH}/${crop.imgName}`} />
              </div>

              <div className={styles.textCon}>
                {/* 작물이름 시작 */}
                <div className={styles.titleCon}>
                  <p
                    className={[
                      styles.grey,
                      styles.fontBold,
                      styles.font15rem,
                      styles.cursor,
                    ].join(" ")}
                  >
                    {crop.crop}
                  </p>
                  <p
                    className={[
                      styles.grey,
                      styles.fontLight,
                      styles.font08rem,
                    ].join(" ")}
                  >
                    {crop.engName}
                  </p>
                </div>
                {/* 작물 이름 끝 */}

                {/* 적정 생육 환경 */}
                <div className={styles.textBox}>
                  <div className={styles.textBoxSon}>
                    <span>온도</span>
                    <span>{`${crop.tempMin} ~ ${crop.tempMax}℃`}</span>
                  </div>
                  <div className={styles.textBoxSon}>
                    <span>습도</span>
                    <span>{`${crop.humidMin} ~ ${crop.humidMax}%`}</span>
                  </div>
                  <div className={styles.textBoxSon}>
                    <span>적정 조도</span>
                    <span>{`${crop.adcMin} ~ ${crop.adcMax}`}</span>
                  </div>
                  <div className={styles.textBoxSon}>
                    <span>적정 토양수분</span>
                    <span>{`${crop.soilMin} ~ ${crop.soilMax}%`}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {/* */}
      </div>
    </div>
  );
};

export default FarmerPlantList;
