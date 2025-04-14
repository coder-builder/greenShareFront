import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../redux/axiosinstance";
import styles from "./FarmerCoummintyReplyEdit.module.css";

const FarmerCommunityReplyEdit = ({ commentId, content, writerEmail, setRefresh }) => {
  const [editContent, setEditContent] = useState(content);
  const [isUpdate, setIsUpdate] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [role, setRole] = useState(null);

  // ✅ JWT 디코딩하여 userEmail과 role 추출
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const base64Payload = token.split(".")[1];
        const decoded = JSON.parse(atob(base64Payload));
        setUserEmail(decoded.sub);
        setRole(decoded.role);
      } catch (err) {
        console.error("토큰 디코딩 실패", err);
      }
    }
  }, []);

  const handleUpdate = () => {
    axiosInstance
      .put(`/plantReplies/${commentId}`, {
        content: editContent,
        commentId: commentId,
      })
      .then(() => {
        alert("댓글이 수정되었습니다.");
        setIsUpdate(false);
        setRefresh((prev) => prev + 1);
      })
      .catch((error) => {
        console.error(error);
        alert("댓글 수정 중 오류가 발생했습니다.");
      });
  };

  const canEdit = userEmail && (userEmail === writerEmail || role === "ROLE_ADMIN");

  return (
    <div className={styles.editBox}>
      {isUpdate ? (
        <>
          <textarea
            className={styles.textarea}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
          <div className={styles.buttonGroup}>
            <button className={styles.button} onClick={handleUpdate}>
              완료
            </button>
            <button
              className={`${styles.button} ${styles.cancelButton}`}
              onClick={() => setIsUpdate(false)}
            >
              취소
            </button>
          </div>
        </>
      ) : (
        <>
          <div>{content}</div>
          {canEdit && (
            <button className={styles.button} onClick={() => setIsUpdate(true)}>
              수정
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default FarmerCommunityReplyEdit;
