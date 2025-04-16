import React, { useEffect, useState } from "react";
import { pic } from "./../../../consts/pic"; // 이미지 경로
import { useNavigate } from "react-router-dom";
import Weather from "./Weather";
import MainBanner from "./MainBanner";

const MainPage = () => {
  const nav = useNavigate();

  // 이미지를 변경할 인덱스를 state로 관리
  const images = [pic.image1, pic.image2, pic.image3]; // pic 객체에 다른 이미지 추가
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // 3초마다 이미지 변경

    // 컴포넌트가 unmount될 때 clearInterval
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div>
        <MainBanner />
      </div>
      <div>
        <Weather />
      </div>
    </>
  );
};

export default MainPage;
