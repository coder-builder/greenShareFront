import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { detailStory } from "../../apis/plantStory";
import styles from "./FamerCommunityDetail.module.css";
import dayjs from "dayjs";
import axios from "axios";

const FarmerCommunityDetail = () => {
  const nav = useNavigate();

  const { boardNum } = useParams();

  //게시글 상세 정보를 받는 변수
  const [storyDetail, setStoryDetail] = useState({});

  useEffect(() => {
    detailStory(boardNum)
      .then((res) => setStoryDetail(res.data))
      .catch((error) => console.log(error));
  }, [boardNum]);

  //게시글 삭제하는 api통신 함수
  const deleteDetail = (boardNum) => {
    const result = confirm("정말 삭제할까요?");
    if (!result) {
      return;
    }
    axios
      .delete(`/api/plantStories/${boardNum}`)
      .then((res) => {
        alert("삭제되었습니다");
        nav("/community");
      })
      .catch((error) => console.log(error));
  };

  //댓글 변수
  //1.댓글 등록===========================

  //댓글 등록 정보를 담는 변수
  const [comment, setComment] = useState({
    userEmail: "",
    content: "",
    boardNum: boardNum,
  });

  //댓글 등록 정보를 갱신하는 함수
  const handleRegReply = (e) => {
    setComment({
      ...comment,
      [e.target.name]: e.target.value,
    });
  };

  //댓글 등록하는 api통신
  const regReply = (comment) => {
    axios
      .post("/api/plantReplies", comment)
      .then((res) => {
        alert("댓글이 등록되었습니다");
        setComment({
          ...comment,
          userEmail: "",
          content: "",
        });
        setRefresh(refresh + 1);
      })
      .catch((error) => console.log(error));
  };

  //2.댓글 조회 =============================

  //댓글 바로 바로 갱신 하도록 하는 변수
  const [refresh, setRefresh] = useState(0);

  //각 게시물의 댓글을 조회하는 api통신
  useEffect(() => {
    axios
      .get(`/api/plantReplies/${boardNum}`)
      .then((res) => setReplyList(res.data))
      .catch((error) => console.log(error));
  }, [refresh]);

  //각 게시물 댓글 정보를 담는 변수
  const [replyList, setReplyList] = useState([]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <p>{storyDetail.userEmail}</p>
          <p>팔로우</p>
        </div>

        <div className={styles.titleDiv}>
          <h2>{storyDetail.title}</h2>
          <div className={styles.likeDiv}>
            <p>{dayjs(storyDetail.regDate).format("YYYY-MM-DD")}</p>
            <p>조회수: {storyDetail.readCnt}</p>
            <p>좋아요 누르기</p>
          </div>
        </div>

        <div className={styles.contentDiv}>
          <p>{storyDetail.content}</p>
          <p>이미지</p>
        </div>

        {/* --댓글 영역-- */}
        <div className={styles.replyDiv}>
          <p>댓글: {replyList.length}</p>
          {replyList.map((reply, i) => {
            return (
              <div key={i} className={styles.reply_content}>
                <div>
                  <p>{`${reply.userEmail} · ${dayjs(reply.regDate).format(
                    "YYYY-MM-DD"
                  )}`}</p>
                  <button
                    type="button"
                    onClick={(e) => {
                      const result = confirm("정말 삭제 하나요?");
                      if (!result) {
                        return;
                      }
                      axios
                        .delete(`/api/plantReplies/${reply.commentId}`)
                        .then((res) => {
                          setRefresh(refresh + 1);
                          alert("삭제가 완료되었습니다");
                        })
                        .catch((error) => console.log(error));
                    }}
                  >
                    삭제
                  </button>
                </div>
                <div>{reply.content}</div>
              </div>
            );
          })}

          <div className={styles.reply_reg}>
            {/* 이것도 마찬가지로 테스트용 로그인 기능과 회원가입기능과 연계해야함 */}
            <input
              type="text"
              placeholder="본인의 이메일을 입력하세요"
              name="userEmail"
              value={comment.userEmail}
              onChange={(e) => handleRegReply(e)}
            />
            <div className={styles.reply_reg_detail}>
              <textarea
                name="content"
                value={comment.content}
                onChange={(e) => handleRegReply(e)}
              ></textarea>
              <button
                type="button"
                onClick={(e) => {
                  if (comment.content === "") {
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
          <button
            type="button"
            onClick={() => {
              nav("/community");
            }}
          >
            목록 가기
          </button>
          <div className={styles.update_delete_btn}>
            <button
              type="button"
              onClick={(e) => {
                nav(`/update-community/${boardNum}`);
              }}
            >
              수정
            </button>
            <button type="button" onClick={(e) => deleteDetail(boardNum)}>
              삭제
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FarmerCommunityDetail;
