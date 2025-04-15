import React, { useState, useEffect } from "react";
import axios from "axios";

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null); // 날씨 데이터 저장할 상태

  // 데이터 요청
  const fetchWeatherData = () => {
    axios.get('api/weather/info')
      .then((res) => {
        setWeatherData(res.data);  // 받아온 데이터 상태 저장
      })
      .catch((err) => {
        console.error("데이터 불러오기 실패!", err);
      });
  };

  useEffect(() => {
    fetchWeatherData(); // 컴포넌트 렌더링 될 때 실행
  }, []);

  return (
    <div>
    
      {weatherData ? (
        <div>
          <p>지역: {weatherData.name}</p>
          <p>날씨: {weatherData.weather[0].description}</p>
          <p>온도: {weatherData.main.temp} K</p>
          <p>체감 온도: {weatherData.main.feels_like} K</p>
          <p>습도: {weatherData.main.humidity}%</p>
          <p>풍속: {weatherData.wind.speed} m/s</p>
        </div>
      ) : (
        <p>날씨 정보를 불러오는 중...</p>
      )}
    </div>
  );
};

export default Weather;
