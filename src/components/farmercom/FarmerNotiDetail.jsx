import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./FarmerNotiDetail.module.css";
import { axiosInstance } from "../../redux/axiosInstance";
import { useSelector } from "react-redux";
import { isAdmin, isAuthenticated } from "../../redux/authCheck";

const FarmerNotiDetail = () => {
  const nav = useNavigate();
  const { num } = useParams();
   //수정 여부를 묻는 데이터를 저장
  const [isEdit, setIsEdit] = useState(false);
  const [data, setData] = useState({});
  const token = useSelector((state) => state.auth.token);

  // 게시글 상세데이터 가져오기
  useEffect(() => {
    axiosInstance
      .get(`/farmers/${num}`)
      .then((res) => {
        setData(res.data);
        console.log(res.data);    
      })
      .catch((error) => {
        console.error(error);
      });
  }, [num]);

  const trueEdit = () => {
    setIsEdit(!isEdit);
  };

  const changeInfo = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  //수정기능
  const update = () => {
    axiosInstance
      .put(`/farmers/${data.boardNum}`, data)
      .then((res) => {
        alert("수정 완료하였습니다.");
        setIsEdit(false);
        console.log(res.data)
      })
      .catch((error) => {
        console.error(error);
        alert("수정 오류입니다.");
      });
  };

  const deleteBoard = () => {
    const result = confirm("삭제하겠습니까?");
    if (!result) {
      return;
    }
    axiosInstance
      .delete(`/deleteFarmers/${num}`)
      .then(() => {
        alert("삭제가 완료되었습니다.");
        nav("/noti");
      })
      .catch((error) => {
        console.error(error);
        alert("삭제에 실패했습니다.");
      });
  };

  //댓글정보 조회
  const [replyList, setReplyList] = useState([]);

  const [sum, setSum] = useState(0);

  //댓글 목록 조회,마운트 + num값이 변경될때도 실행
  useEffect(() => {
    axiosInstance
      .get(`/replyFarmers/${num}`)
      .then((res) => {
        setReplyList(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [sum]);

  const [replyInfo, setReplyInfo] = useState({
    content: "",
    boardNum: num,
  });

  const insertReply = () => {
    // 1. 로그인 안 되어 있으면 등록 못 하게 막기
    if (!isAuthenticated(token)) {
      alert("로그인 후 댓글을 입력할 수 있습니다.");
      return;
    }
  
    //댓글 내용미입력시 경고창
    if (!replyInfo.content.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }
   
    //댓글 등록 기능
    axiosInstance
      .post("/replyFarmers", replyInfo)
      .then((res) => {
        alert("댓글 등록되었습니다.");
        setSum(sum + 1);
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
  

  const replyChange = (e) => {
    setReplyInfo({
      ...replyInfo,
      [e.target.name]: e.target.value,
    });
  };

  const deleteReply = (replyNum) => {
    const result = confirm("삭제하시겠습니까?");
    if (!result) return;

    axiosInstance
      .delete(`/api/replyFarmers/${replyNum}`)
      .then(() => {
        setSum(sum + 1);
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
                    value={data.title}
                    onChange={changeInfo}
                    className={styles.titleFont}
                  />
                ) : (
                  data.title
                )}
              </th>
            </tr>
            <tr className={styles.secondContainer}>
              <td>작성자: {data.userEmail}</td>
              <td>날짜: {dayjs(data.date).format("YYYY년 MM월 DD일")}</td>
              <td>조회수: {data.views}</td>
            </tr>
            <tr>
              <td>
                {isEdit ? (
                  <textarea
                    className={styles.insertContent}
                    rows="25"
                    cols="150"
                    name="content"
                    value={data.content}
                    onChange={changeInfo}
                  />
                ) : (
                  data.content
                )}
              </td>
            </tr>
          </thead>
        </table>
        {
          isAdmin(token) && (
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
          )
        }
      </div>

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
                    <button
                      className={styles.deleteReplyBtn}
                      onClick={() => deleteReply(reply.replyNum)}
                    >
                      삭제
                    </button>
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
            <button 
            className={styles.replyBtn} 
            onClick={insertReply}>댓글 등록</button>
          </div>
      </div>
      </div>
    </div>
  );
};

export default FarmerNotiDetail;
