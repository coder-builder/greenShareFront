import React, { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getReciverId } from "../../apis/userApi";
import { axiosInstance } from "../../redux/axiosInstance";

const NoteBox = ({ incomingNote }) => {
  const [followList, setFollowList] = useState([]);
  const [isShow, setIsShow] = useState(false);

  const [notes, setNotes] = useState([]);
  const [input, setInput] = useState("");
  const [receiver, setReceiver] = useState("");
  const [stompClient, setStompClient] = useState(null);
  const notesEndRef = useRef(null);

  const token = localStorage.getItem("accessToken");

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

  const fetchFollowList = async (userEmail) => {
    try {
      const response = await axiosInstance.get('/follow', {
        params: { fromUserEmail: userEmail }
      });
  
      const followList = response.data; // toUserEmail만 있음
  
      const updatedList = await Promise.all(
        followList.map(async (user) => {
          try {
            const onlineStatus = await axiosInstance.get('/users/online', {
              params: { userEmail: user.toUserEmail }
            });
  
            return {
              ...user,
              isOnline: onlineStatus.data, // 여기서 추가
            };
          } catch (error) {
            console.error('온라인 상태 확인 실패', error);
            return {
              ...user,
              isOnline: false // 실패하면 기본 false
            };
          }
        })
      );
  
      console.log("✅ updatedList (isOnline 추가됨)", updatedList);
      setFollowList(updatedList);
  
    } catch (error) {
      console.error('팔로우 리스트 가져오기 실패', error);
    }
  };
  
  
  


  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(`http://192.168.30.110:8080/ws?token=${token}`), // ✅ Bearer 없이 token만 붙인다
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

  // 받은 메시지가 들어오면 notes에 추가
  useEffect(() => {
    if (incomingNote) {
      console.log("📥 NoteBox가 받은 새 메시지:", incomingNote);

      const formatted = {
        senderEmail: incomingNote.senderEmail,
        receiverEmail: incomingNote.receiverEmail,
        content: incomingNote.content,
        sendDate: incomingNote.sentAt || new Date().toISOString(), // 시간 필드 보정
      };

      setNotes((prev) => [...prev, formatted]);
    }
  }, [incomingNote]);


  useEffect(() => {
    const userEmail = getUserEmail();
    if (userEmail) {
      fetchFollowList(userEmail);
    }
  }, []); // ✅ 빈 배열
  
  
  
  const handleReceiverSelect = (email) => {
    setReceiver(email); // 클릭한 이메일을 수신자 입력창에 자동으로 설정
  };
  



  return (
    
    <>
        <p 
          onClick={() => 
            setIsShow(!isShow)
          }
          style={{ cursor: "pointer", textAlign: "center", color: "#3b6f47", marginBottom: "10px" }}
        >
          {isShow ? " 수신자 목록 닫기" : "수신자 목록 열기"}
        </p>
        
        {isShow && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center", marginBottom: "20px" }}>
            {followList.length > 0 ? (
              followList.map((user) => (
                
                <div
                  key={user.toUserEmail}
                  onClick={() => {
                    handleReceiverSelect(user.toUserEmail);
                    setIsShow(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 12px",
                    border: "1px solid #c8e6c9",
                    borderRadius: "20px",
                    cursor: "pointer",
                    backgroundColor: "#e8f5e9",
                    fontSize: "0.9rem",
                  }}
                >
                  {/* 온라인 상태 점 (초록/회색) */}
                  <div style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: (user.isOnline === true || user.isOnline === "true") ? "#4caf50" : "#cfd8dc"

                  }} />
                  {/* 이메일 표시 */}
                  {user.toUserEmail}
                </div>
                
              ))
            ) : (
              <div style={{ fontSize: "0.85rem", color: "#888" }}>
                팔로우한 사용자가 없습니다.
              </div>
            )}
          </div>
        )}







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
      </div>



      

    </>
  );
};

export default NoteBox;
