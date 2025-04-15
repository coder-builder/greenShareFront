import { useEffect } from "react";
import { Client, Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const SocketTest = () => {
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"), // 절대경로
      reconnectDelay: 5000,
      debug: (str) => console.log("[STOMP]", str),
    });


    client.onConnect = () => {
      console.log("✅ 연결 성공!");
    };

    client.onStompError = (frame) => {
      console.error("❌ STOMP 에러:", frame.headers["message"]);
      console.error("내용:", frame.body);
    };

    client.onWebSocketError = (e) => {
      console.error("❌ WebSocket 에러:", e);
    };

    client.onWebSocketClose = (e) => {
      console.warn("🔌 WebSocket 연결 종료:", e);
    };

    client.activate(); // ✅ 반드시 있어야 실제 연결이 발생함

    return () => {
      client.deactivate();
    };
  }, []);

  return <div>🧪 WebSocket 연결 테스트 중</div>;
};

export default SocketTest;
