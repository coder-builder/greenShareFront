import React, { useState } from "react";
import styles from "./SideBar.module.css";
import MessageSocket from "../messageSocket/MessageSocket";
import MessageList from "../messageSocket/MessageList";

const SideBar = ({ isVisible }) => {
  const [isShow, setIsShow] = useState(false);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: isVisible ? 0 : "-300px",
        width: "300px",
        height: "100%",
        backgroundColor: "white",
        transition: "left 0.5s ease-in-out",
        boxShadow: isVisible ? "4px 0 10px rgba(0, 0, 0, 0.5)" : "none",
      }}
      className={styles.mainCon}
    >
      <div
        onClick={(e) => {
          setIsShow(!isShow);
        }}
      >
        쪽지함
      </div>

      {isShow ? (
        <>
          <MessageSocket />
          <MessageList />
        </>
      ) : null}
    </div>
  );
};

export default SideBar;
