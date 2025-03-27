
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
  Legend
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

import React from 'react'


const Dashboard = () => {
  const [labels, setLabels] = useState([]);
  const [temperatureData, setTemperatureData] = useState([]);
  const [illuminanceData, setIlluminanceData] = useState([]);


  const fetchData = async () => {
    try {
      const res = await axios.get("/api/environment");

      const labelList = res.data.map((item) =>
        new Date(item.join_date).toLocaleTimeString()
      );
      const tempList = res.data.map((item) => item.temperature);
      const illList = res.data.map((item) => item.illuminance);

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
        borderColor: "rgba(255,99,132,1)",
        backgroundColor: "rgba(255,99,132,0.2)",
        tension: 0.4
      },
      {
        label: "조도 (lx)",
        data: illuminanceData,
        borderColor: "rgba(54,162,235,1)",
        backgroundColor: "rgba(54,162,235,0.2)",
        tension: 0.4
      },
      
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "📊 온도 / 조도 환경 대시보드"
      },
      legend: {
        position: "top"
      }
    }
  };

  return (
    
    
    <>
      <div>dashboard</div>
        
      <div style={{ width: "90%", maxWidth: "800px", margin: "2rem auto" }}>
      <Line data={data} options={options} />
    </div>
  
        
        
      
    </>

    
    
    

  
  return (
    <div>Dashboard</div>

  )
}

export default Dashboard