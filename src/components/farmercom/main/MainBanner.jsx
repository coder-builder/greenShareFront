import React, { useEffect, useState } from "react";
import { pic } from "../../../consts/pic";
import styles from "./MainPage.module.css";
import { useNavigate } from "react-router-dom";

const MainBanner = () => {
  const images = [pic.image1, pic.image2, pic.image3]; // pic 객체에 다른 이미지 추가
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const nav = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setOpacity(0); // opacity를 0으로 변경
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        setOpacity(1); // opacity를 다시 1로 변경
      }, 500); // opacity가 0으로 변한 후에 새로운 이미지로 변경
    }, 3000); // 3초마다 이미지 변경

    // 컴포넌트가 unmount될 때 clearInterval
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.mainCon}>
      <div className={styles.picCon}>
        <img
          src={images[currentImageIndex]} // 현재 인덱스에 맞는 이미지 출력
          alt="슬라이드 이미지"
          style={{
            opacity: opacity, // opacity 값이 적용됨
            transition: "opacity 0.5s ease", // opacity에 대한 transition 적용
          }}
        />
        <button
          className={styles.button}
          type="button"
          onClick={() => {
            nav("/plants");
          }}
        >
          작물 보러가기→{" "}
        </button>
      </div>
    </div>
  );
};

export default MainBanner;
