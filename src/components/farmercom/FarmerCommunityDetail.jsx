import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { detailStory } from "../../apis/plantStory";
import styles from "./FamerCommunityDetail.module.css";
import dayjs from "dayjs";
import { axiosInstance } from "../../redux/axiosInstance";
import FarmerCoummnityReplyEdit from "./FarmerCoummnityReplyEdit";

const FarmerCommunityDetail = () => {
  const nav = useNavigate();
  const { boardNum } = useParams();

  const [storyDetail, setStoryDetail] = useState({});
  const [refresh, setRefresh] = useState(0);
  const [replyList, setReplyList] = useState([]);
  const [comment, setComment] = useState({ content: "", boardNum: boardNum });

  const [userEmail, setUserEmail] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const base64Payload = token.split(".")[1];
        const decoded = JSON.parse(atob(base64Payload));
        setUserEmail(decoded.sub);
        setRole(decoded.role);
      } catch (err) {
        console.error("토큰 디코딩 실패:", err);
      }
    }
  }, []);

  useEffect(() => {
    detailStory(boardNum)
      .then((res) => setStoryDetail(res.data))
      .catch((error) => console.log(error));
  }, [boardNum]);

  const deleteDetail = (boardNum) => {
    if (!confirm("정말 삭제할까요?")) return;
    axiosInstance
      .delete(`/plantStories/${boardNum}`)
      .then(() => {
        alert("삭제되었습니다");
        nav("/community");
      })
      .catch((error) => console.log(error));
  };

  const handleRegReply = (e) => {
    setComment({ ...comment, [e.target.name]: e.target.value });
  };

  const regReply = (comment) => {
    axiosInstance
      .post("/plantReplies", comment)
      .then(() => {
        alert("댓글이 등록되었습니다");
        setComment({ ...comment, content: "" });
        setRefresh((prev) => prev + 1);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    axiosInstance
      .get(`/plantReplies/${boardNum}`)
      .then((res) => setReplyList(res.data))
      .catch((error) => console.log(error));
  }, [refresh]);


  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <p>{storyDetail.userEmail}</p>
      </div>

      <div className={styles.titleDiv}>
        <h2>{storyDetail.title}</h2>
        <div className={styles.likeDiv}>
          <p>{dayjs(storyDetail.regDate).format("YYYY-MM-DD")}</p>
          <p>조회수: {storyDetail.readCnt}</p>
        </div>
      </div>

      <div className={styles.contentDiv}>
        <p dangerouslySetInnerHTML={{ __html: storyDetail.content }}></p>
      </div>

      <div className={styles.replyDiv}>
        <p>댓글: {replyList.length}</p>
        {replyList.map((reply, i) => (
          <div key={i} className={styles.reply_content}>
            <div>
              <p>{`${reply.userEmail} · ${dayjs(reply.regDate).format("YYYY-MM-DD")}`}</p>
              {(reply.userEmail === userEmail || role === "ROLE_ADMIN") && (
                <button
                  type="button"
                  onClick={() => {
                    if (!confirm("정말 삭제 하나요?")) return;
                    axiosInstance
                      .delete(`/plantReplies/${reply.commentId}`)
                      .then(() => {
                        setRefresh((prev) => prev + 1);
                        alert("삭제가 완료되었습니다");
                      })
                      .catch((error) => console.log(error));
                  }}
                >
                  삭제
                </button>
              )}
            </div>
            <FarmerCoummnityReplyEdit
              content={reply.content}
              commentId={reply.commentId}
              writerEmail={reply.userEmail} 
              setRefresh={setRefresh}
            />
          </div>
        ))}

        <div className={styles.reply_reg}>
          <div className={styles.reply_reg_detail}>
            <textarea
              name="content"
              value={comment.content}
              onChange={handleRegReply}
              placeholder="댓글을 입력하세요"
            />
            <button
              type="button"
              onClick={() => {
                if(!userEmail){
                  alert("회원가입 후 이용하세요")
                  return;
                }
                if (!comment.content) {
                  alert("내용을 입력하세요");
                  return;
                }
                regReply(comment);
              }}
            >
              댓글등록
            </button>
          </div>
        </div>
      </div>

      <div className={styles.bottom_btn}>
        <button type="button" onClick={() => nav("/community")}>
          목록 가기
        </button>
        {(storyDetail.userEmail === userEmail || role === "ROLE_ADMIN") && (
          <div className={styles.update_delete_btn}>
            <button onClick={() => nav(`/update-community/${boardNum}`)}>수정</button>
            <button onClick={() => deleteDetail(boardNum)}>삭제</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerCommunityDetail;
