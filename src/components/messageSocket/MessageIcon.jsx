import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FaEnvelope } from "react-icons/fa"; // react-icons 설치 필요: npm install react-icons
import NoteBox from "./NoteBox";
import ChatSocket from "./ChatSocket"; // ✅ 추가됨

const MessageIcon = () => {
  const user = useSelector((state) => state.auth.user); // 로그인 정보
  const [open, setOpen] = useState(false);
  const [newMessage, setNewMessage] = useState(false); // 새 메시지 알림

  //수신한 메세지 저장
  const [latestNote, setLatestNote] = useState(null);

  if (!user) return null;

  return (
    <>
      <ChatSocket
        onMessageReceive={(msg) => {
          console.log("💌 받은 메시지:", msg); // 확인용
          setNewMessage(true); // new 뱃지 표시
          setLatestNote(msg); // NoteBox로 전달할 메시지 저장
        }}
      />

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
        onClick={() => {
          setOpen((prev) => !prev);
          setNewMessage(false); // 알림 제거
        }}
        title="쪽지함 열기"
      >
        <FaEnvelope size={28} />
      </div>

      {/* 새 메시지 알림 */}
      {newMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "66px",
            right: "30px",
            zIndex: 200,
            display: "block",
            padding: "2px 8px",
            borderRadius: "8px",
            fontSize: "0.8rem",
            backgroundColor: "crimson",
            color: "white",
          }}
        >
          new
        </div>
      )}

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
          <NoteBox incomingNote={latestNote} />
        </div>
      )}
    </>
  );
};

export default MessageIcon;
