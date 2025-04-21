import { useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const ChatSocket = ({ onMessageReceive }) => {
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () =>
        new SockJS(`http://192.168.30.70:8080/ws?token=${token}`),
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      console.log("✅ 쪽지 WebSocket 연결 성공");
      //반드시 "/user/queue/notes"
      client.subscribe("/user/queue/notes", (message) => {
        const msg = JSON.parse(message.body);
        console.log("💌 수신된 쪽지:", message.body);
        onMessageReceive(msg); // 부모 컴포넌트에서 전달받은 메시지 처리 함수 호출
      });
    };

    client.activate();
    return () => client.deactivate();
  }, [onMessageReceive]);

  return null;
};

export default ChatSocket;
