import React, { useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const MessageSocket = ({ setRefresh }) => {
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      console.log("✅ WebSocket 연결 성공");
      client.subscribe("/user/queue/messages", (message) => {
        const msg = JSON.parse(message.body);
        // alert(`새 쪽지!\n보낸사람: ${msg.senderEmail}\n내용: ${msg.content}`);
        // setRefresh((prev) => prev + 1);
      });
    };
    client.activate();
    return () => client.deactivate();
  }, []);

  return null;
};

export default MessageSocket;
