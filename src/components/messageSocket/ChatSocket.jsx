import { useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const ChatSocket = ({ onMessageReceive }) => {
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
   const client = new Client({
      webSocketFactory: () =>
        new SockJS(`http://localhost:8080/ws?token=${token}`),
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      console.log("✅ 쪽지 WebSocket 연결 성공");
      client.subscribe("/user/queue/notes", (message) => {
        const msg = JSON.parse(message.body);
        console.log("💌 수신된 쪽지:", msg);
        onMessageReceive?.(msg); // 알림 트리거
      });
    };

    client.activate();
    return () => client.deactivate();
  }, [onMessageReceive]);

  return null;
};

export default ChatSocket;
