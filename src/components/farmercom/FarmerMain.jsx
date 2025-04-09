import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../header/Header";
import SideBar from "../side/SideBar";
import styles from "./Main.module.css";

const FarmerMain = ({ isVisible }) => {
  return (
    <div className={styles.main}>
      <SideBar isVisible={isVisible} />

      <div className={styles.contentArea}>
        <Header />
        <Outlet />
        <div className={styles.imageWrapper}>
          <img src="/isto.jpg" alt="메인 이미지" className={styles.img} />
          <div className={styles.logo}>
            <img src="/logo.png" alt="로고" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerMain;
