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
      </div>
    </div>
  );
};

export default FarmerMain;
