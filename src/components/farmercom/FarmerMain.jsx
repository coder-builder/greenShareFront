import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../header/Header";
import styles from "./Main.module.css";
import Weather from "./Weather";

const FarmerMain = () => {
  return (
    <div className={styles.main}>

      <div className={styles.contentArea}>
        <Header />
        <Outlet />
      </div>
    </div>
  );
};

export default FarmerMain;
