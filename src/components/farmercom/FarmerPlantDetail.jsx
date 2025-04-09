import React, { useEffect, useState } from "react";
import styles from "./FarmerPlantDetail.module.css";
import Dashboard from "./Dashboard.jsx";
import axios from "axios";
import { useParams } from "react-router-dom";
import { IMAGE_PATH } from "../../consts/upload";

const FarmerPlantDetail = () => {
  const { id } = useParams(); //  URL에서 작물 ID 추출
  const [cropDetail, setCropDetail] = useState({});

  //  작물 한 개 조회
  useEffect(() => {
    if (!id) return;

    axios
      .get(`/api/plants/${id}`)
      .then((res) => {
        console.log(res.data);
        console.log(id);
        setCropDetail(res.data);
      })
      .catch((error) => {
        console.log("작물 조회 실패:", error);
      });
  }, [id]);

  return (
    <div className={styles.container}>
      <div className={styles.subContainer}>
        <div className={styles.imgCon}>
          <p className={styles.title}>{cropDetail.crop} 환경 정보</p>
          <img
            src={`${IMAGE_PATH}/${cropDetail.imgName}`}
            alt={cropDetail.crop}
          />
        </div>
        <Dashboard
          customTitle="농장 환경 센서 데이터"
          autoRefresh={true}
          refreshInterval={10000}
          showStandardInfo={false}
          id={id}
        />
      </div>

      {/* 식물 적정 데이터  */}
      <table className={styles.detailTable}>
        <thead>
          <tr>
            <th>온도(°C)</th>
            <th>습도(%)</th>
            <th>조도(lux)</th>
            <th>토양수분(%)</th>
            <th>ADC</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              {cropDetail.tempMin} ~ {cropDetail.tempMax}
            </td>
            <td>
              {cropDetail.humidMin} ~ {cropDetail.humidMax}
            </td>
            <td>
              {cropDetail.luxMin} ~ {cropDetail.luxMax}
            </td>
            <td>
              {cropDetail.soilMin} ~ {cropDetail.soilMax}
            </td>
            <td>
              {cropDetail.adcMin} ~ {cropDetail.adcMax}
            </td>
          </tr>
        </tbody>
      </table>

      {/* 작물의 기본 정보를 보여줌 */}
      <div className={styles.description}>
        <h3>Information</h3>
        <p>{cropDetail.description}</p>
      </div>
    </div>
  );
};

export default FarmerPlantDetail;
