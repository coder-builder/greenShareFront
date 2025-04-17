import React, { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import ChatSocket from "./ChatSocket";

const NoteBox = () => {
  const [notes, setNotes] = useState({});
  const [input, setInput] = useState("");
  const [receiver, setReceiver] = useState("");
  const [stompClient, setStompClient] = useState(null);
  const notesEndRef = useRef(null);

  const token = localStorage.getItem("accessToken");

  const handleReceive = (msg) => {
    setNotes( msg);
  };

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(`http://localhost:8080/ws?token=${token}`),
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
    if (input.trim() === "" || receiver.trim() === "") return;
    if (stompClient && stompClient.connected) {
      stompClient.publish({
        destination: "/app/note/send",
        body: JSON.stringify({ senderEmail: "bbb@gmail.com", receiverEmail: receiver, content: input }),
      });
      setInput("");
    } else {
      alert("❌ WebSocket이 연결되지 않았습니다.");
    }
  };

  useEffect(() => {
    notesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [notes]);

  return (
    <div style={{ border: "1px solid #ccc", padding: "20px", maxWidth: "500px", margin: "0 auto" }}>
      <h2>📨 실시간 쪽지</h2>
      <div style={{ height: "300px", overflowY: "auto", border: "1px solid #eee", padding: "10px", marginBottom: "10px" }}>
        {/* {notes.map((msg, idx) => (
           <div key={idx}><strong>{msg.sender}</strong> → <strong>{msg.receiverEmail}</strong>: {msg.content}</div>
        ))} */}
        <div><strong>{notes.sender}</strong> → <strong>{notes.receiverEmail}</strong>: {notes.content}</div>
        <div ref={notesEndRef} />
      </div>
      <input
        type="email"
        value={receiver}
        onChange={(e) => setReceiver(e.target.value)}
        placeholder="받는 사람 이메일"
        style={{ width: "100%", marginBottom: "8px" }}
      />
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendNote()}
        style={{ width: "100%", marginBottom: "10px" }}
        placeholder="쪽지 내용을 입력하세요"
      />
      <button onClick={sendNote} style={{ padding: "8px 12px" }}>보내기</button>

      {/* 수신 소켓 연결 */}
      <ChatSocket onMessageReceive={handleReceive} />
    </div>
  );
};

export default NoteBox;