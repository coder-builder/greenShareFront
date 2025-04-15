import axios from "axios";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./UserQnaDetail.module.css";

const UserQnaDetail = () => {
  const nav = useNavigate();
  const qnaNum = useParams();

  //수정 여부를 묻는 데이터를 저장
  const [isEdit, setIsEdit] = useState(false);

  // 상세 데이터 저장
  const [qnaData, setQnaData] = useState({});

  useEffect(() => {
    axios
      .get(`/api/qna/${qnaNum.num}`)
      .then((res) => {
        console.log(res.data);
        setQnaData(res.data);
      })
      .catch((error) => {
        console.log(error); 
      });
  }, [qnaNum]);

  const trueEdit = () => {
    setIsEdit(!isEdit);
  };

  const changeInfo = (e) => {
    setQnaData({
      ...qnaData,
      [e.target.name]: e.target.value,
    });
  };

  // 수정 기능
  const update = () => {
    axios
      .put(`/api/qna/${qnaData.qnaNum}`, qnaData)
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
      .delete(`/api/qna/${qnaNum.num}`)
      .then((res) => {
        alert("삭제가 완료되었습니다.");
        nav("/qna");
      })
      .catch((error) => {
        alert("삭제에 실패했습니다.");
        console.error(error);
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
              <td>작성자 :{qnaData.writer}</td>

              <td>날짜:{dayjs(qnaData.date).format("YYYY년 MM월 DD일")}</td>
              <td>진행상태:{qnaData.status}</td>
            </tr>
            <tr>
              <td>
                {isEdit ? (
                  <textarea
                    type="text"
                    rows={"25"}
                    cols={"150"}
                    name="content"
                    value={qnaData.content}
                    onChange={changeInfo}
                  />
                ) : (
                  qnaData.content
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
    </div>
  );
};

export default UserQnaDetail;
