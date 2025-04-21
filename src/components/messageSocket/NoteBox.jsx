import React, { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import ChatSocket from "./ChatSocket";
import { getReciverId } from "../../apis/userApi";

const NoteBox = ({onNewMessage}) => {
  const [notes, setNotes] = useState([]);
  const [input, setInput] = useState("");
  const [receiver, setReceiver] = useState("");
  const [stompClient, setStompClient] = useState(null);
  const notesEndRef = useRef(null);

  const token = localStorage.getItem("accessToken");

  //수신자 체크를 위한 토큰에서 유저이메일 추출
  const getUserEmail = () => {
    if (!token) return null;
    try {
      const payload = token.split(".")[1];
      const decoded = JSON.parse(atob(payload));
      return decoded.sub;
    } catch (e) {
      return null;
    }
  };

  const handleReceive = (msg) => {
    setNotes((prev) => [...prev, msg]);
    if (onNewMessage) {
      onNewMessage(); // 부모에게 새 메시지 알림!
    }
  };

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () =>
        new SockJS(`http://localhost:8080/ws?token=${token}`),
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      console.log("✅ 전송용 WebSocket 연결됨");
      setStompClient(client);
    };

    client.activate();
    return () => client.deactivate();
  }, []);

  const sendNote = () => {
    const senderEmail = getUserEmail();

    if (!senderEmail) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (!receiver || !input) {
      alert("받는 사람의 이메일과 내용을 모두 입력해주세요.");
      return;
    }

    getReciverId(receiver)
      .then((res) => {
        if (res.data) {
          if (stompClient && stompClient.connected) {
            stompClient.publish({
              destination: "/app/note/send",
              body: JSON.stringify({
                senderEmail,
                receiverEmail: receiver,
                content: input,
              }),
            });

            setNotes((prev) => [
              ...prev,
              {
                senderEmail,
                receiverEmail: receiver,
                content: input,
                sendDate: new Date().toISOString(),
              },
            ]);

            setInput("");
          } else {
            alert("❌ WebSocket 연결이 되지 않았습니다.");
          }
        } else {
          alert("수신자 이메일이 존재하지 않습니다.");
        }
      })
      .catch((err) => {
        console.error("수신자 확인 실패", err);
      });
  };


  useEffect(() => {
    notesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [notes]);

  return (
    <div
    style={{
      border: "1px solid #d6e9d6",
      borderRadius: "12px",
      padding: "20px",
      maxWidth: "460px",
      margin: "40px auto",
      backgroundColor: "#f4fcf5",
      fontFamily: "'Noto Sans KR', sans-serif",
    }}
  >
    <h2
      style={{
        textAlign: "center",
        marginBottom: "20px",
        fontSize: "1.2rem",
        color: "#3b6f47",
      }}
    >
      🌱 실시간 채팅
    </h2>

    <div
      style={{
        height: "300px",
        overflowY: "auto",
        border: "1px solid #e1f0e4",
        borderRadius: "10px",
        padding: "12px",
        marginBottom: "16px",
        backgroundColor: "#ffffff",
      }}
    >
      {notes.map((msg, idx) => {
        const isSender = getUserEmail() === msg.senderEmail;

        return (
          <div key={idx} style={{ marginBottom: "12px" }}>
            {!isSender && (
              <div
                style={{
                  marginBottom: "4px",
                  fontStyle: "italic",
                  fontSize: "0.75rem",
                  color: "#6a826e",
                }}
              >
                {msg.senderEmail}
              </div>
            )}
            <div
              style={{
                maxWidth: "80%",
                padding: "10px",
                borderRadius: "10px",
                fontSize: "0.85rem",
                backgroundColor: isSender ? "#81c784" : "#e2f5e9",
                color: isSender ? "#fff" : "#2e5737",
                marginLeft: isSender ? "auto" : "0",
              }}
            >
              {msg.content}
            </div>
          </div>
        );
      })}
      <div ref={notesEndRef} />
    </div>

    <input
      type="email"
      value={receiver}
      onChange={(e) => setReceiver(e.target.value)}
      placeholder="받는 사람 이메일"
      style={{
        width: "100%",
        padding: "10px",
        marginBottom: "10px",
        borderRadius: "8px",
        border: "1px solid #c8e6c9",
        fontSize: "0.9rem",
      }}
    />
    <input
      type="text"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && sendNote()}
      placeholder="채팅 내용을 입력하세요"
      style={{
        width: "100%",
        padding: "10px",
        marginBottom: "12px",
        borderRadius: "8px",
        border: "1px solid #c8e6c9",
        fontSize: "0.9rem",
      }}
    />
    <button
      onClick={sendNote}
      style={{
        width: "100%",
        padding: "12px",
        borderRadius: "8px",
        border: "none",
        backgroundColor: "#66bb6a",
        color: "#ffffff",
        fontSize: "1rem",
        fontWeight: "bold",
        cursor: "pointer",
      }}
    >
      🌼 보내기
    </button>

    {/* 수신 소켓 연결 */}
    <ChatSocket onMessageReceive={handleReceive} />
  </div>
  );
};

export default NoteBox;
