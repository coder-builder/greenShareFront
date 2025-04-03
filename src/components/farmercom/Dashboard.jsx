import React, { useEffect, useState } from "react";
import axios from "axios";
import { color } from "./../../consts/color"; // 색상 상수 import
import styles from "./Dashboard.module.css";

const Dashboard = ({
  autoRefresh = true,
  refreshInterval = 5000,
  customTitle = "환경 센서 요약",
  showStandardInfo = false,
}) => {
  // 최신 센서 데이터를 저장할 상태 변수 정의
  const [latest, setLatest] = useState({
    temperature: 0,
    illuminance: 0,
    humidity: 0,
    soilMoisture: 0,
    time: "",
  });

  // API로부터 환경 데이터를 가져오는 함수
  const fetchData = async () => {
    try {
      const res = await axios.get("/api/environment"); // API 호출
      const latestData = res.data[res.data.length - 1]; // 가장 최근 데이터 사용

      // 최신 값으로 상태 업데이트
      setLatest({
        temperature: latestData.temperature,
        illuminance: latestData.illuminance,
        humidity: latestData.humidity,
        soilMoisture: latestData.soilMoisture,
        time: new Date(latestData.joinDate).toLocaleTimeString(),
      });
    } catch (err) {
      console.error("데이터 가져오기 실패:", err); // 에러 처리
    }
  };

  const [showInfo, setShowInfo] = useState(false); // 클릭시 데이터오픈

  const ImageClick = () => {
    setShowInfo(!showInfo); // 클릭하면
  };

  // 컴포넌트가 처음 렌더링될 때 데이터 가져오기 + 5초마다 갱신
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // 5초마다 업데이트
    return () => clearInterval(interval); // 언마운트 시 인터벌 제거
  }, []);

  return (
    <>
      <div className={styles.dashboardContainer}>
        <h2 className={styles.dashboardTitle}>
          환경 센서 요약 (업데이트: {latest.time})
        </h2>

        <div className={styles.cardWrapper}>
          {/* 온도 카드 */}
          <div
            className={styles.card}
            style={{ borderLeft: `6px solid ${color.main}` }}
          >
            <h3 className={styles.cardTitle} style={{ color: color.main }}>
              🌡 온도
            </h3>
            <p className={styles.cardValue}>{latest.temperature} °C</p>
          </div>

          {/* 조도 카드 */}
          <div
            className={styles.card}
            style={{ borderLeft: `6px solid ${color.sub}` }}
          >
            <h3 className={styles.cardTitle} style={{ color: color.sub }}>
              💡 조도:ADC
            </h3>
            <p className={styles.cardValue}>{latest.illuminance} lux</p>
          </div>

          {/* 습도 카드 */}
          <div
            className={styles.card}
            style={{ borderLeft: `6px solid ${color.accent || "#999"}` }}
          >
            <h3
              className={styles.cardTitle}
              style={{ color: color.accent || "#999" }}
            >
              💧 습도
            </h3>
            <p className={styles.cardValue}>{latest.humidity} %</p>
          </div>

          {/* 토양수분 카드 */}
          <div
            className={styles.card}
            style={{ borderLeft: `6px solid ${color.accent || "#62d48f"}` }}
          >
            <h3
              className={styles.cardTitle}
              style={{ color: color.accent || "#62d48f" }}
            >
              🌱 토양수분
            </h3>
            <p className={styles.cardValue}>{latest.soilMoisture} %</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
