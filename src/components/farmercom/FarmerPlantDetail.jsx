import React, { useEffect, useState } from "react";
import styles from "./FarmerPlantDetail.module.css";
import Dashboard from "./Dashboard.jsx";
import axios from "axios";
import { useParams } from "react-router-dom";
import { IMAGE_PATH } from "../../consts/upload";

const FarmerPlantDetail = () => {
  const { id } = useParams(); //  URL에서 작물 ID 추출
  const [cropDetail, setCropDetail] = useState(null); // 초기값 null로 설정

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
    <>
      <div className={styles.container}>
        <h1 className={styles.title}> 식물 상세 환경 정보</h1>

        <Dashboard
          customTitle="농장 환경 센서 데이터"
          autoRefresh={true}
          refreshInterval={10000}
          showStandardInfo={false}
        />
      </div>

      {/* cropDetail이 존재할 때만 표시 */}
      {cropDetail && (
        <table className={styles.detailTable}>
          <thead>
            <tr>
              <th>작물명</th>
              <th>이미지</th>
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
                <img
                  src={`${IMAGE_PATH}/${cropDetail.imgName}`}
                  alt={cropDetail.crop}
                  className={styles.cropImage}
                />
              </td>
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
      )}
    </>
  );
};

export default FarmerPlantDetail;
