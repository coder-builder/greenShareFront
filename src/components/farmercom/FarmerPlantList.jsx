import React, { useEffect, useState } from "react";
import styles from "./List.module.css";
import { icon } from "../../consts/icons";
import { pic } from "../../consts/pic";
import FarmerTestList from "./FarmerTestList";
import Dashboard from "./Dashboard";
import { getCropStandardsList } from "../../apis/envApi";
import { IMAGE_PATH } from "../../consts/upload";

const FarmerPlantList = () => {
  const [cropList, setCropList] = useState([]);

  useEffect(() => {
    getCropStandardsList()
      .then((res) => setCropList(res.data))
      .catch((e) => console.log(e));
  }, []);

  return (
    /* 식물 목록페이지 */

    <div className={styles.mainCon}>
      <div>나의 농작물</div>

      <div className={styles.subCon}>
        {/* */}
        {cropList.map((crop, i) => {
          return (
            <div className={styles.infoCon} key={i}>
              <div className={styles.picCon}>
                <img src={`${IMAGE_PATH}/${crop.imgName}`} /> 
              </div>
              <div className={styles.textCon}>
              <div
                  className={[
                    styles.green,
                    styles.fontBold,
                    styles.font15rem,
                    styles.letterSpace2,
                  ].join(" ")}
                >
                  <p>{crop.crop}</p>
                </div>
                <div className={styles.textBox}>
                  <span>{`적정 온도: ${crop.tempMin}도 ~ ${crop.tempMax}도`}</span>
                  <span>{`적정 습도: ${crop.humidMin}% ~ ${crop.humidMax}%`}</span>
                  <span>{`적정 조도(LUX): ${crop.luxMin} ~ ${crop.luxMax}`}</span>
                  <span>{`적정 조도(ADC변환): ${crop.adcMin} ~ ${crop.adcMax}`}</span>
                  <span>{`적정 토양수분: ${crop.soilMin}% ~ ${crop.soilMax}%`}</span>
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
