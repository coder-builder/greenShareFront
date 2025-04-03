import React, { useEffect, useState } from "react";
import axios from "axios";
import { color } from "./../../consts/color"; // 색상 상수 import

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
    <div style={{ width: "100%", margin: "auto" }}>
      {/* 상단 제목과 최신 시간 표시 */}
      <h2
        style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}
      >
        환경 센서 요약 (업데이트: {latest.time})
      </h2>

      {/* 카드 3개를 가로로 정렬 */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {/* 온도 카드 */}
        <div
          style={{
            flex: "1 1 30%",
            backgroundColor: "#fff",
            padding: "1.5rem",
            borderRadius: "1rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            borderLeft: `6px solid ${color.main}`, // 색상 강조 표시
          }}
        >
          <h3 style={{ color: color.main, marginBottom: "0.5rem" }}>🌡 온도</h3>
          <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            {latest.temperature} °C
          </p>
        </div>

        {/* 조도 카드 */}
        <div
          style={{
            flex: "1 1 30%",
            backgroundColor: "#fff",
            padding: "1.5rem",
            borderRadius: "1rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            borderLeft: `6px solid ${color.sub}`,
          }}
        >
          <h3 style={{ color: color.sub, marginBottom: "0.5rem" }}>💡 조도</h3>
          <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            {latest.illuminance} lx
          </p>
        </div>

        {/* 습도 카드 */}
        <div
          style={{
            flex: "1 1 30%",
            backgroundColor: "#fff",
            padding: "1.5rem",
            borderRadius: "1rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            borderLeft: `6px solid ${color.accent || "#999"}`,
          }}
        >
          <h3 style={{ color: color.accent || "#999", marginBottom: "0.5rem" }}>
            💧 습도
          </h3>
          <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            {latest.humidity} %
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
