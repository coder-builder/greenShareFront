import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FaEnvelope } from "react-icons/fa"; // react-icons 설치 필요: npm install react-icons
import NoteBox from "./NoteBox";

const MessageIcon = () => {
  const user = useSelector((state) => state.auth.user); // 로그인 정보
  const [open, setOpen] = useState(true);

  if (!user) return null; // 로그인 안 했으면 아무것도 보여주지 않음

  return (
    <>
   
      {/* 쪽지 아이콘 */}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: "#007bff",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
          zIndex: 100,
        }}
        onClick={() => setOpen((prev) => !prev)}

        title="쪽지함 열기"
      >
        <FaEnvelope size={28} />
      </div>
      <div style={{
        position:'fixed',
        bottom: "66px",
        right: "30px",
        zIndex : 200,
        display:'block',
        padding : '2px 8px',
        borderRadius:'8px',
        fontSize:'0.8rem',
        backgroundColor:'crimson',
        color:'white'
      }}>
        new
      </div>
    

      {/* 쪽지함 박스 */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "90px",
            right: "20px",
            width: "320px",
            maxHeight: "70vh",
            overflowY: "auto",
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "12px",
            padding: "10px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            zIndex: 999,
          }}
        >
          <NoteBox />
        </div>
      )}
    </>
  );
};

export default MessageIcon;
