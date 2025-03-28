import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

import ChartDataLabels from "chartjs-plugin-datalabels"; // 플러그인 import

import { color } from "./../../consts/color";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartDataLabels,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [labels, setLabels] = useState([]);
  const [temperatureData, setTemperatureData] = useState([]);
  const [illuminanceData, setIlluminanceData] = useState([]);
  const [hour, setHour] = useState("");

  /* 시간 타입 설정을 받아오는 함수 */
  const selectType = (e) => {
    /* 셀렉트 박스 선택시 자료가 바뀌게 */
    console.log(`axios.get("/api/environment${e.target.value}")`);
    setHour(`axios.get("/api/environment${e.target.value}")`);
  };

  const fetchData = async () => {
    try {
      /*  */
      const res = await axios.get("/api/environment");

      const labelList = res.data
        .map((item) => new Date(item.joinDate).toLocaleTimeString())
        .reverse();

      const tempList = res.data.map((item) => item.temperature).reverse();
      const illList = res.data.map((item) => item.illuminance).reverse();
      console.log(res.data);
      setLabels(labelList);
      setTemperatureData(tempList);
      setIlluminanceData(illList);
    } catch (err) {
      console.error("데이터 가져오기 실패:", err);
    }
  };

  useEffect(() => {
    fetchData(); // 최초 로딩
    const interval = setInterval(fetchData, 5000); // 5초마다 갱신
    return () => clearInterval(interval);
  }, []);

  const data = {
    labels: labels,
    datasets: [
      {
        label: "온도 (°C)",
        data: temperatureData,
        borderColor: color.main,
        backgroundColor: color.main,
        tension: 0,
        datalabels: {
          display: true,
          align: "bottom", // 아래 정렬
          anchor: "end",
          offset: -20, // 점 위에서 5px 위로 이동
          color: color.main,
        },
      },
      {
        label: "조도 (lx)",
        data: illuminanceData,
        borderColor: color.sub,
        backgroundColor: color.sub,
        tension: 0,
        datalabels: {
          display: true,
          align: "bottom", // 아래 정렬
          anchor: "end",
          offset: -20, // 점 위에서 5px 위로 이동
          color: color.sub,
        },
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "온도 / 조도 환경 대시보드",
      },
      legend: {
        position: "top",
        align: "end",
        labels: {
          usePointStyle: true, // 범례의 색상을 원 형태로 표시
        },
      },
      tooltip: {
        // 툴팁 설정 추가
        backgroundColor: "white", // 배경색 흰색
        titleColor: "black", // 제목 색상
        bodyColor: "black", // 내용 색상
        padding: 10,
        boxPadding: 5,

        borderColor: "rgba(0, 0, 0, 0.1)", // 테두리 색상
        borderWidth: 1, // 테두리 두께
        displayColors: false, // 범례 색상 표시 안 함
        caretSize: 8, // 화살표 크기
        caretPadding: 10,
        position: "nearest", // 툴팁 위치를 평균값으로 설정
        callbacks: {
          label: function (tooltipItem) {
            return tooltipItem.dataset.label + ": " + tooltipItem.raw;
          },
        },
        custom: function (tooltip) {
          // 툴팁 위치 수정
          if (!tooltip) return;
          tooltip.y = tooltip.y + 10; // 툴팁을 아래로 이동
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // 세로선 숨기기
        },
        offset: true, //양끝에 여백
        ticks: {
          autoSkip: false, // 모든 라벨을 표시
        }, // 데이터의 끝점보다 1 큰 값
      },
      y: {
        grid: {
          display: false, // 세로선 숨기기
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <>
      <div style={{ width: "90%", maxWidth: "900px", margin: "2rem auto" }}>
        <select
          name="hour"
          value={hour}
          onChange={(e) => {
            selectType(e);
          }}
        >
          <option value="">최근 25분</option>
          <option value="sdf">최근 한시간</option>
          <option value="">최근 여섯시간</option>
        </select>
        <Line data={data} options={options} />
      </div>
    </>
  );
};

export default Dashboard;
