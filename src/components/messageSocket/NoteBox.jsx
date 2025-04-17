import React, { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import ChatSocket from "./ChatSocket";
import { getReciverId } from "../../apis/userApi";

const NoteBox = () => {
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
        border: "1px solid #ccc",
        padding: "20px",
        maxWidth: "500px",
        margin: "0 auto",
      }}
    >
      <h2>📨 실시간 채팅</h2>
      <div
        style={{
          height: "300px",
          overflowY: "auto",
          border: "1px solid #eee",
          padding: "10px",
          marginBottom: "10px",
        }}
      >
        {notes.map((msg, idx) => (
          <>
            {
              getUserEmail() !==  msg.senderEmail && 
              <>
                <div 
                  style={{
                    marginBottom:'4px',
                    fontStyle : 'italic',
                    fontSize : '0.7rem'
                  }}
                >
                  {msg.senderEmail}
                </div> 
              </>
            }
          
            <div 
              key={idx}
              style={{
                width:'80%',
                padding:'10px',
                borderRadius:'8px',
                fontSize : '0.8rem',
                marginBottom:'10px',
                backgroundColor : getUserEmail() ===  msg.senderEmail?'green':'lightskyblue',
                marginLeft:getUserEmail() ===  msg.senderEmail? 'auto' : '0px' ,
                color:getUserEmail() ===  msg.senderEmail? 'white' : 'black' 
              }}
            >
              
              <div>{msg.content}</div>

              {/* <strong>{msg.senderEmail}</strong>  <strong>{msg.receiverEmail}</strong>
              : {msg.content} * */}
            </div>
          </>
        ))}
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
        placeholder="채팅 내용을 입력하세요"
      />
      <button onClick={sendNote} style={{ padding: "8px 12px" }}>
        보내기
      </button>

      {/* 수신 소켓 연결 */}
      <ChatSocket onMessageReceive={handleReceive} />
    </div>
  );
};

export default NoteBox;
