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
        setCropDetail(res.data);
      })
      .catch((error) => {
        console.log("작물 조회 실패:", error);
      });
  }, [id]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}> 식물 상세 환경 정보</h1>
     
      <div className={styles.Img_data}>
        <img
          src={`${IMAGE_PATH}/${cropDetail.imgName}`}
          alt={cropDetail.crop}
          className={styles.cropImage}
        />
        <Dashboard
          customTitle="농장 환경 센서 데이터"
          autoRefresh={true}
          refreshInterval={10000}
          showStandardInfo={false}
        />
      </div>
      
      {/* 식물 적정 데이터  */}
      <table className={styles.detailTable}>
        <thead>
          <tr>
            <th>작물명</th>
            <th>온도(°C)</th>
            <th>습도(%)</th>
            <th>조도(lux)</th>
            <th>토양수분(%)</th>
            <th>ADC</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{cropDetail.crop}</td>
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
