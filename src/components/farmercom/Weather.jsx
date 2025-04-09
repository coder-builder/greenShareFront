import React, { useState, useEffect } from "react";
import axios from "axios";

const Weather = () => {
  const [weatherData, setWeatherData] = useState({ weather: "", temperature: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get('/api/weather')
      .then((res) => {
        console.log(res.data)
        setWeatherData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("날씨 정보를 불러오는 데 실패했습니다.");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>🌤️ 날씨 정보를 불러오는 중...</p>;
  if (error) return <p>⚠️ 오류: {error}</p>;  

  return (
    <div className="App">
      <h2> 날씨</h2>
      <p><strong>날씨:</strong> {weatherData.weather}</p>
      <p><strong>기온:</strong> {weatherData.temperature}</p>
    </div>
  );
};

export default Weather;
