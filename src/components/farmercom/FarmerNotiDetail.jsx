import axios from "axios";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./FarmerNotiDetail.module.css";

const FarmerNotiDetail = () => {
  const nav = useNavigate();
  const boardNum = useParams();

  // // 수정 여부를 묻는 데이터를 저장
  const [isEdit, setIsEdit] = useState(false);

  // 상세 데이터 저장
  const [data, setData] = useState({});

  useEffect(() => {
    axios
      .get(`/api/farmers/${boardNum.num}`)
      .then((res) => {
        setData(res.data);
        console.log(boardNum.num)
      })
      .catch((error) => {
        console.log(error);
      });
  }, [boardNum]);

  const trueEdit = () => {
    setIsEdit(!isEdit);
  };

  const changeInfo = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  // 수정 기능
  const update = () => {
    axios
      .put(`/api/farmers/${data.boardNum}`, data)
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
    if (!result){
       return;
      }

    axios
      .delete(`/api/farmers/${boardNum.num}`)

    axios
      .delete(`/api/farmers/${boardNum.num}`)
      .then(() => {
        alert("삭제가 완료되었습니다.");
        nav("/noti");
      })
      .catch((error) => {
        alert("삭제에 실패했습니다.");
        console.error(error);
      });
  };

  const [replyList, setReplyList] = useState([]);

  //댓글 목록 조회
  const [num, setNum] = useState(0);
  useEffect(() => {
    axios
      .get(`/api/replyFarmers/${boardNum.num}`)
      .then((res) => {
        setReplyList(res.data);
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [boardNum, num]);

  // 등록할 댓글 정보를 저장할 변수
  const [replyInfo, setReplyInfo] = useState({
    writer: "",
    content: "",
    boardNum: boardNum.num,
  });

  //댓글 등록 기능
  const insertReply = () => {
    axios
      .post("/api/replyFarmers", replyInfo)
      .then((res) => {
        alert("댓글 등록됐습니다");
        // 목록 다시 조회
        setNum(num + 1);
        setReplyInfo({
          ...replyInfo,
          writer: "",
          content: "",
        });
      })
      .catch((error) => {
        alert("실패");
        console.log(error);
      });
  };
  console.log(replyInfo);

  // 댓글 입력시 실행되는 기능
  const replyChange = (e) => {
    setReplyInfo({
      ...replyInfo,
      [e.target.name]: e.target.value,
    });
  };

  //댓글 삭제 기능
  const deleteReply = (replyNum) => {
    const result = confirm("삭제?");
    if (!result) {
      return;
    }
    axios
      .delete(`/api/replyFarmers/${replyNum}`)
      .then((res) => {
        //다시 댓글 목록을 조회 -> num값 변경
        setNum(num + 1);
      })
      .catch((error) => {
        console.log(error);
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
              <td>작성자 :{data.writer}</td>

              <td>날짜:{dayjs(data.date).format("YYYY년 MM월 DD일")}</td>
              <td>조회수:{data.views}</td>
            </tr>
            <tr>
              <td>
                {isEdit ? (
                  <textarea
                    type="text"
                    rows={"25"}
                    cols={"150"}
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
        <div>
          <button
            type="button"
            onClick={isEdit ? update : trueEdit}
            className={styles.changeButton}
          >
            {isEdit ? "수정 완료" : "수정하기"}
          </button>
          <button type="button" onClick={deleteBoard}
          className={styles.replyDelteBtn}>
            삭제하기
          </button>
        </div>
      </div>
      <div className={styles.replyContainer}>
        <div>
          <input
            type="text"
            placeholder="작성자"
            className={styles.input}
            name="writer"
            value={replyInfo.writer}
            onChange={(e) => replyChange(e)}
          />
        </div>
        <textarea
          className={styles.content}
          name="content"
          value={replyInfo.content}
          onChange={(e) => replyChange(e)}
        />
        <div>
          <button type="button" className={styles.button} onClick={insertReply}>
            등록하기
          </button>
        </div>
      </div>
      <div>
        {replyList.map((reply, i) => {
          return (
            <div key={i} className={styles.comment}>
              <di>{reply.writer}</di>
              <div></div>

              <div>{reply.content}</div>
              <div className={styles.deleteBtnContainer}>
                {dayjs(reply.regDate).format("YYYY.MM.DD")}
                <button
                  type="button"
                  className={styles.deleteBtn}
                  onClick={() => deleteReply(reply.replyNum)}
                >
                  삭제하기
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FarmerNotiDetail;
