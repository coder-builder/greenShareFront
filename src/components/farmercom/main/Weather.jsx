import React, { useEffect, useState } from "react";
import styles from "./Weather.module.css";
const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState({ lat: null, lon: null });
  const [loading, setLoading] = useState(true);

  const API_KEY = "7f191024dfb6a42e07617f4b6a048581"; /* api키 입력하는 곳 */

  useEffect(() => {
    // 위치 정보 얻기
    navigator.geolocation.getCurrentPosition(
      /* 위치 정보를 받아오는 함수 */
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        console.error("위치 정보 에러:", error);
        setLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    if (location.lat && location.lon) {
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${API_KEY}&units=metric&lang=kr`
      )
        .then((res) => res.json())
        .then((data) => {
          setWeatherData(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("날씨 API 에러:", error);
          setLoading(false);
        });
    }
  }, [location]);

  if (loading) return <p>날씨 정보를 불러오는 중...</p>;
  if (!weatherData) return <p>날씨 정보를 불러올 수 없습니다.</p>;

  return (
    <div className={styles.app}>
      <h1 className={styles.title}>현재 위치의 날씨 정보</h1>
      <div className={styles.cardGrid}>
        <div className={styles.weatherCard}>
          <h2 className={styles.cardTitle}>위치</h2>
          <p className={styles.cardContent}>{weatherData.name}</p>
        </div>
        <div className={styles.weatherCard}>
          <h2 className={styles.cardTitle}>온도</h2>
          <p className={styles.cardContent}>{weatherData.main.temp}°C</p>
        </div>
        <div className={styles.weatherCard}>
          <h2 className={styles.cardTitle}>습도</h2>
          <p className={styles.cardContent}>{weatherData.main.humidity}%</p>
        </div>
        <div className={styles.weatherCard}>
          <h2 className={styles.cardTitle}>체감 온도</h2>
          <p className={styles.cardContent}>{weatherData.main.feels_like}°C</p>
        </div>
      </div>
    </div>
  );
};

export default Weather;
