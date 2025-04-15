import React, { useEffect, useState } from "react";
import axios from "axios";
import { color } from "./../../consts/color"; // 색상 상수 import
import styles from "./Dashboard.module.css";
import { useNavigate } from "react-router-dom";
import LuxDetail from "./detailboard/LuxDetail";

const Dashboard = ({
  autoRefresh = true,
  refreshInterval = 5000,
  customTitle = "환경 센서 요약",
  showStandardInfo = false,
  cropDetail,
  id,
}) => {
  // 최신 센서 데이터를 저장할 상태 변수 정의
  const [latest, setLatest] = useState({
    temperature: 0,
    illuminance: 0,
    humidity: 0,
    soilMoisture: 0,
    joinDate: "",
  });

  const isTempOk = (value /* 적정 온도 판단하는 함수 */) =>
    value >= cropDetail.tempMin && value <= cropDetail.tempMax;

  const isHumidOk = (value /* 적정 습도 판단하는 함수 */) =>
    value >= cropDetail.humidMin && value <= cropDetail.humidMax;

  const isSoilOk = (value /* 적정 토양 수분 판단하는 함수 */) =>
    value >= cropDetail.soilMin && value <= cropDetail.soilMax;

  const isLuxOk = (value /* 적정 조도 판단하는 함수 */) =>
    value >= cropDetail.adcMin && value <= cropDetail.adcMax;

  const nav = useNavigate();

  const handleCardClick = (type) => {
    nav(`/plant/${id}/${type}`); // 예: /graph/temperature
  };

  // API로부터 환경 데이터를 가져오는 함수
  const fetchData = async () => {
    try {
      const res = await axios.get("/api/environment/latest"); // API 호출
      const latestData = res.data; // 가장 최근 데이터 사용

      // 최신 값으로 상태 업데이트
      setLatest({
        temperature: latestData.temperature,
        illuminance: latestData.illuminance,
        humidity: latestData.humidity,
        soilMoisture: latestData.soilMoisture,
        joinDate: new Date(latestData.joinDate).toLocaleTimeString(),
      });
    } catch (err) {
      console.error("데이터 가져오기 실패:", err); // 에러 처리
    }
  };

  const [showInfo, setShowInfo] = useState(false); // 클릭시 데이터오픈

  const ImageClick = () => {
    setShowInfo(!showInfo); // 클릭하면
  };

  // 컴포넌트가 처음 렌더링될 때 데이터 가져오기 + 30초마다 갱신
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // 30초마다 업데이트
    return () => clearInterval(interval); // 언마운트 시 인터벌 제거
  }, []);

  return (
    <>
      <div className={styles.dashboardContainer}>
        <h2 className={styles.dashboardTitle}>
          <p>현재 환경 ({latest.joinDate})</p>
          <button
            className={styles.backButton}
            onClick={() => {
              nav("/plants");
            }}
          >
            ← 뒤로가기
          </button>
        </h2>

        <div className={styles.cardWrapper}>
          {/* 온도 카드 */}
          <div
            className={styles.card}
            style={{
              borderLeft: `3px solid ${
                isTempOk(latest.temperature) ? "#27B06E" : color.red
              }`,
            }}
            onClick={() => handleCardClick("temperature")}
          >
            <div className={styles.cardHeader}>
              <h3
                className={styles.cardTitle}
                style={{
                  color: color.dgrey,
                }}
              >
                🌡️ 온도
              </h3>
              <p className={styles.statusText}>
                {isTempOk(latest.temperature) ? (
                  <span style={{ color: color.main }}>● 적정 환경입니다</span>
                ) : (
                  <span style={{ color: color.red }}>
                    ● 적정 환경이 아닙니다
                  </span>
                )}
              </p>
            </div>
            <p className={styles.cardValue}>{latest.temperature} °C</p>
          </div>

          {/* 조도 카드 */}
          <div
            className={styles.card}
            style={{
              borderLeft: `3px solid ${
                isLuxOk(latest.illuminance) ? "#27B06E" : color.red
              }`,
            }}
            onClick={() => handleCardClick("illuminance")}
          >
            <div className={styles.cardHeader}>
              <h3
                className={styles.cardTitle}
                style={{
                  color: color.dgrey,
                }}
              >
                💡 조도:ADC
              </h3>
              <p className={styles.statusText}>
                {isLuxOk(latest.illuminance) ? (
                  <span style={{ color: color.main }}>● 적정 환경입니다</span>
                ) : (
                  <span style={{ color: color.red }}>
                    ● 적정 환경이 아닙니다
                  </span>
                )}
              </p>
            </div>
            <p className={styles.cardValue}>{latest.illuminance} ADC</p>
          </div>

          {/* 습도 카드 */}
          <div
            className={styles.card}
            style={{
              borderLeft: `3px solid ${
                isHumidOk(latest.humidity) ? "#27B06E" : color.red
              }`,
            }}
            onClick={() => handleCardClick("humidity")}
          >
            <div className={styles.cardHeader}>
              <h3
                className={styles.cardTitle}
                style={{
                  color: color.dgrey,
                }}
              >
                💧 습도
              </h3>
              <p className={styles.statusText}>
                {isHumidOk(latest.humidity) ? (
                  <span style={{ color: color.main }}>● 적정 환경입니다</span>
                ) : (
                  <span style={{ color: color.red }}>
                    ● 적정 환경이 아닙니다
                  </span>
                )}
              </p>
            </div>
            <p className={styles.cardValue}>{latest.humidity} %</p>
          </div>

          {/* 토양수분 카드 */}
          <div
            className={styles.card}
            style={{
              borderLeft: `3px solid ${
                isSoilOk(latest.soilMoisture) ? "green" : color.red
              }`,
            }}
            onClick={() => handleCardClick("soilMoisture")}
          >
            <div className={styles.cardHeader}>
              <h3
                className={styles.cardTitle}
                style={{
                  color: color.dgrey,
                }}
              >
                🌱 토양수분
              </h3>
              <p className={styles.statusText}>
                {isSoilOk(latest.soilMoisture) ? (
                  <span style={{ color: color.main }}>● 적정 환경입니다</span>
                ) : (
                  <span style={{ color: color.red }}>
                    ● 적정 환경이 아닙니다
                  </span>
                )}
              </p>
            </div>
            <p className={styles.cardValue}>{latest.soilMoisture} %</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
