import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { insertStories } from "../../apis/plantStory";
import styles from "./FarmerCommunityInsert.module.css";

const FarmerCommunityInsert = () => {
  const nav = useNavigate();

  const [insertStory, setInsertStory] = useState({
    title: "",
    content: "",
    userEmail: "",
  });

  const handleStory = (e) => {
    setInsertStory({
      ...insertStory,
      [e.target.name]: e.target.value,
    });
  };

  const sendInsert = (insertStory) => {
    insertStories(insertStory)
      .then(res => alert("등록되었습니다"))
      .catch((error) => {console.log(error)
        alert('등록 실패!')
      });
  };

  return (
    <>
      <h3>이야기를 올려주세요!</h3>

      <div className={styles.container}>
        <div className={styles.title}>
          <p>제목</p>
          <input
            placeholder="제목을 입력하세요"
            type="text"
            name="title"
            value={insertStory.title}
            onChange={(e) => handleStory(e)}
          />
        </div>
        <div className={styles.content}>
          <p>내용</p>
          <textarea
            name="content"
            value={insertStory.content}
            onChange={(e) => handleStory(e)}
          ></textarea>
        </div>

        {/* 테스트 용 */}
        <div>
          <p>작성자</p>
          <input
            // placeholder: 테스트용입니다.
            //로그인,회원가입 기능에서 storge에서 get으로 userEmail자동 삽입하게 수정해야함
            //지금은 테스트용 유저 이메일을 넣어야 해요
            placeholder="본인의 이메일을 입력하세요"
            type="text"
            name="userEmail"
            value={insertStory.userEmail}
            onChange={(e) => handleStory(e)}
          />
        </div>
      </div>

      <div className={styles.btn}>
        <button type="button" onClick={(e) => nav("/community")}>
          목록 가기
        </button>
        <button type="button" onClick={(e) => sendInsert(insertStory)}>
          작성 완료
        </button>
      </div>
    </>
  );
};

export default FarmerCommunityInsert;
