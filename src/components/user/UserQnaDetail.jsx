import axios from "axios";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./UserQnaDetail.module.css";
import { useSelector } from "react-redux";
import { isAdmin, isAuthenticated } from "../../redux/authCheck";
import { axiosInstance } from "../../redux/axiosInstance";
import { jwtDecode } from "jwt-decode";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const UserQnaDetail = () => {
  const nav = useNavigate();
  const qnaNum = useParams();
  const token = useSelector((state) => state.auth.token);
  const userEmail = token ? jwtDecode(token).sub : null;

  // 수정 여부를 묻는 데이터를 저장
  const [isEdit, setIsEdit] = useState(false);

  // 상세 데이터 저장
  const [qnaData, setQnaData] = useState({});

  // 상세 데이터 가져오기
  useEffect(() => {
    axios
      .get(`/api/qna/${qnaNum.num}`)
      .then((res) => {
        setQnaData(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [qnaNum]);

  // 수정 버튼 클릭 시 수정 여부 묻기
  const trueEdit = () => {
    setIsEdit(!isEdit);
  };

  // 수정 데이터 변경하는 함수
  const changeInfo = (e) => {
    setQnaData({
      ...qnaData,
      [e.target.name]: e.target.value,
    });
  };

  // 수정 기능
  const update = () => {
    axiosInstance
      .put(`/qna/${qnaData.qnaNum}`, qnaData)
      .then(() => {
        alert("수정 완료하였습니다.");
        setIsEdit(false);
      })
      .catch((error) => {
        console.error(error);
        alert("수정 오류!!!!.");
      });
  };

  // 게시글 삭제 기능
  const deleteBoard = () => {
    const result = confirm("삭제하겠습니까?");
    if (!result) {
      return;
    }
    axiosInstance
      .delete(`qna/${qnaNum.num}`)
      .then((res) => {
        alert("삭제가 완료되었습니다.");
        nav("/qna");
      })
      .catch((error) => {
        alert("삭제에 실패했습니다.");
        console.error(error);
      });
  };

  // 댓글정보 저장
  const [replyList, setReplyList] = useState([]);
  const [num, setNum] = useState(0);

  // 댓글 목록 가져오기
  useEffect(() => {
    axiosInstance
      .get(`/replyQna/${qnaNum.num}`)
      .then((res) => {
        setReplyList(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [num]);

  const [replyInfo, setReplyInfo] = useState({
    content: "",
    qnaNum: qnaNum.num,
  });

  const replyChange = (e) => {
    setReplyInfo({
      ...replyInfo,
      [e.target.name]: e.target.value,
    });
  };

  // 댓글 등록
  const insertReply = () => {
    if (!isAuthenticated(token)) {
      alert("로그인 후 댓글을 입력할 수 있습니다.");
      return;
    }

    //공백일때 유효성검사
    if (!replyInfo.content.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }

    axiosInstance
      .post("/replyQna", replyInfo)
      .then((res) => {
        alert("댓글 등록되었습니다.");
        setNum(num + 1);
        setReplyInfo({
          ...replyInfo,
          content: "",
        });
      })
      .catch((error) => {
        console.error(error);
        alert("댓글 등록에 실패했습니다.");
      });
  };

  const deleteReply = (replyNum) => {
    const result = confirm("삭제하시겠습니까?");
    if (!result) return;

    axiosInstance
      .delete(`/replyQna/${replyNum}`)
      .then(() => {
        setNum(num + 1);
      })
      .catch((error) => {
        console.error(error);
        alert("댓글 삭제에 실패했습니다.");
      });
  };

  return (
    <div>
      <div className={styles.mainContainer}>
        <table>
          <thead>
            <tr>
              <th className={styles.title}>
                {isEdit ? (
                  <input
                    type="text"
                    name="title"
                    value={qnaData.title}
                    onChange={changeInfo}
                    className={styles.titleFont}
                  />
                ) : (
                  qnaData.title
                )}
              </th>
            </tr>
            <tr className={styles.secondContainer}>
              <td>작성자: {qnaData.userEmail}</td>
              <td>날짜: {dayjs(qnaData.date).format("YYYY년 MM월 DD일")}</td>
              <td>조회수: {qnaData.views}</td>
            </tr>
            <tr>
              <td>
                {isEdit ? (
                  <ReactQuill
                    value={qnaData.content}
                    onChange={(value) =>
                      setQnaData({ ...qnaData, content: value })
                    }
                    modules={{
                      toolbar: {
                        container: [
                          [{ header: [1, 2, 3, 4, 5, false] }],
                          ["bold", "underline", "image"],
                        ],
                      },
                    }}
                    style={{ height: "400px" }}
                  />
                ) : (
                 <div className={styles.contentDiv}>
                         <p dangerouslySetInnerHTML={{ __html: qnaData.content }}></p>
                       </div>
                )}
              </td>
            </tr>
          </thead>
        </table>

        {(isAdmin(token) || qnaData.userEmail === userEmail) && (
          <div className={styles.btnContainer}>
            <button
              type="button"
              onClick={isEdit ? update : trueEdit}
              className={styles.changeButton}
            >
              {isEdit ? "수정 완료" : "수정하기"}
            </button>
            <button
              type="button"
              onClick={deleteBoard}
              className={styles.replyDelteBtn}
            >
              삭제하기
            </button>
          </div>
        )}
      </div>
      <p className={styles.contentBox}>댓글: {replyList.length}</p>
      <div className={styles.replyBox}>
        <div className={styles.replySection}>
          {replyList.length === 0 ? (
            <div>등록된 댓글이 없습니다.</div>
          ) : (
            replyList.map((reply, i) => (
              <div key={i} className={styles.replyItem}>
                <div className={styles.replyHeader}>
                  <span>{reply.userEmail}</span>
                  <div className={styles.replyContent}>{reply.content}</div>
                  <div className={styles.replyDate}>
                    <span>{dayjs(reply.date).format("YYYY년 MM월 DD일")}</span>

                    {reply.userEmail === userEmail || isAdmin(token) ? (
                      <button
                        className={styles.deleteReplyBtn}
                        onClick={() => deleteReply(reply.replyNum)}
                      >
                        삭제
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            ))
          )}

          <div className={styles.replyForm}>
            <textarea
              className={styles.commentInput}
              placeholder={
                isAuthenticated(token)
                  ? "댓글 내용을 입력해주세요."
                  : "로그인 후 댓글을 입력할 수 있습니다."
              }
              value={replyInfo.content}
              name="content"
              onChange={replyChange}
            />
            <button className={styles.replyBtn} onClick={insertReply}>
              댓글 등록
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserQnaDetail;
