import { Client } from '@stomp/stompjs';
import React, { useEffect, useState } from 'react'
import SockJS from 'sockjs-client';
import { getReciverId } from '../../apis/userApi';

const MessageSend = () => {
  const [stompClient, setStompClient] = useState(null);
  const [receiverEmail, setReceiverEmail] = useState("");
  const [content, setContent] = useState("");

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

  // 연결 전용: 폼 자체에서 WebSocket도 열어야 전송 가능
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      console.log("✅ WebSocket (보내기용) 연결 성공");
      setStompClient(client);
    };

    client.activate();
    return () => client.deactivate();
  }, []);

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

    getReciverId(receiverEmail)
      .then((res) => {
        if (res.data) {
          if (stompClient && stompClient.connected) {
            stompClient.publish({
              destination: "/app/message/send",
              body: JSON.stringify({ senderEmail, receiverEmail, content }),
            });
            alert("✅ 쪽지 전송 완료!");
            setReceiverEmail("");
            setContent("");
          } else {
            alert("⚠️ WebSocket이 아직 연결되지 않았습니다.");
          }
        } else {
          alert("입력하신 수신자 정보는 없는 정보입니다.");
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "10px", maxWidth: "400px", margin: "0 auto" }}>
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
        style={{ width: "100%", padding: "10px", backgroundColor: "#4CAF50", color: "white", border: "none" }}
      >
        쪽지 보내기
      </button>
    </div>
  );
};

export default MessageSend