import React from "react";
import { pic } from "./../../../consts/pic";
import styles from "./MainPage.module.css";
import { useNavigate } from "react-router-dom";
import Weather from "./Weather";

const MainPage = () => {
  const nav = useNavigate();
  return (
    <div className={styles.mainCon}>
      <div className={styles.picCon}>
        <img
          src={pic.main}
          onClick={() => {
            nav("/plants");
          }}
        />
      </div>
      <Weather />
    </div>
  );
};

export default MainPage;
