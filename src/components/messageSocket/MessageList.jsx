import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../redux/axiosInstance";
import dayjs from "dayjs";
import styles from "./MessageList.module.css";

const MessageList = ({ refresh, setRefresh }) => {
  const [message, setMessage] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/notes")
      .then((res) => {
        setMessage(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [refresh]);

  const handleDelete = (id) => {
    if (!confirm("쪽지를 삭제할까요?")) {
      return;
    }

    axiosInstance
      .delete(`/notes/${id}`)
      .then((res) => {
        alert("삭제가 완료 되었습니다");
      })
      .catch((error) => console.log(error));
    setRefresh((prev) => prev + 1);
  };

  return (
    <>
      <div className={styles.message_list}>
        <h3>📬 나의 쪽지함</h3>
        {message.length === 0 ? (
          <p>받은 쪽지가 없습니다.</p>
        ) : (
          message.map((note) => (
            <div key={note.id} className={styles.message_card}>
              <div>
                <strong>보낸 사람:</strong> {note.senderEmail}
              </div>
              <div>
                <strong>내용:</strong> {note.content}
              </div>
              <div>
                <strong>보낸 시각:</strong>
                {dayjs(note.sentAt).format("YYYY년 MM월 DD일 HH시 mm분")}
              </div>
              <button
                type="button"
                onClick={(e) => {
                  handleDelete(note.id);
                }}
              >
                삭제
              </button>
            </div>
          ))
        )}
        <button onClick={() => setRefresh(prev => prev + 1)}>🔄 새로고침</button>
      </div>
    </>
  );
};

export default MessageList;
