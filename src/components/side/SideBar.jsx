import React from "react";
import styles from "./SideBar.module.css";

const SideBar = ({ isVisible }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: isVisible ? 0 : "-200px",
        width: "200px",
        height: "100%",
        backgroundColor: "white",
        transition: "left 0.5s ease-in-out",
        boxShadow: isVisible ? "4px 0 10px rgba(0, 0, 0, 0.5)" : "none",
      }}
      className={styles.mainCon}
    >
      <h3>Sidebar</h3>
      <p>menu1</p>
    </div>
  );
};

export default SideBar;
