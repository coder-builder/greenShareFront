import { Client } from "@stomp/stompjs";
import { useEffect, useRef } from "react";
import SockJS from "sockjs-client";

function TestSocket() {
  const token = localStorage.getItem("accessToken");
  const stompClient = useRef(undefined);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () =>
        new SockJS(`http://localhost:8080/ws?token=${token}`),
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      console.log("✅ 전송용 WebSocket 연결됨");
      //setStompClient(client);
    };

    client.activate();
    stompClient.current = client;
    return () => client.deactivate();
  }, []);

  return <></>;
}
