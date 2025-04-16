import React, { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { axiosInstance } from "../../redux/axiosInstance";
import { getReciverId } from "../../apis/userApi";

const MessageSocket = () => {
  const [stompClient, setStompClient] = useState(null);
  const [receiverEmail, setReceiverEmail] = useState("");
  const [content, setContent] = useState("");

  // 🔑 JWT에서 사용자 이메일 추출
  const getUserEmail = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;

    try {
      const payload = token.split(".")[1];
      const decoded = JSON.parse(atob(payload));
      return decoded.sub;
    } catch (e) {
      return null;
    }
  };

  // ✅ WebSocket 연결
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"), // SockJS 방식으로 연결
      reconnectDelay: 5000,
      debug: (str) => console.log("[STOMP]", str),
    });

    // 연결 성공 시 구독
    client.onConnect = () => {
      console.log("✅ WebSocket 연결 성공");

      client.subscribe("/user/queue/messages", (message) => {
        const msg = JSON.parse(message.body);
        alert(
          `📨 새 쪽지!\n보낸사람: ${msg.senderEmail}\n내용: ${msg.content}`
        );
      });

      setStompClient(client);
    };

    // WebSocket 연결
    client.activate();

    return () => {
      client.deactivate();
    };
  }, []);

  // ✅ 쪽지 전송
  const sendMessage = () => {
    const senderEmail = getUserEmail();
    if (!senderEmail) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (!receiverEmail || !content) {
      alert("받는 사람과 내용을 모두 입력해주세요.");
      return;
    }

    //수신자 정보 검사
    getReciverId(receiverEmail)
      .then((res) => {
        if (res.data) {
          messageProcess(senderEmail);
        } else {
          alert("입력하신 수신자 정보는 없는 정보입니다.");
        }
      })
      .catch((error) => console.log(error));
  };

  const messageProcess = (senderEmail) => {
    if (stompClient && stompClient.connected) {
      stompClient.publish({
        destination: "/app/message/send",
        body: JSON.stringify({
          senderEmail,
          receiverEmail,
          content,
        }),
      });

      alert("✅ 쪽지 전송 완료!");
      setReceiverEmail("");
      setContent("");
    } else {
      alert("⚠️ WebSocket이 아직 연결되지 않았습니다.");
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        maxWidth: "400px",
        margin: "0 auto",
      }}
    >
      <h2>💌 쪽지 보내기</h2>

      <input
        type="email"
        placeholder="받는 사람 이메일"
        value={receiverEmail}
        onChange={(e) => setReceiverEmail(e.target.value)}
        style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
      />

      <textarea
        placeholder="내용 입력"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
      />

      <button
        onClick={sendMessage}
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
        }}
      >
        쪽지 보내기
      </button>
    </div>
  );
};

export default MessageSocket;
