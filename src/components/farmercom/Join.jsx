import React, { useState } from 'react';
import styles from "./Join.module.css";
import { joinUser } from "../../apis/userApi";

const Join = () => {


  const [joinData, setJoinData] = useState({
    userEmail: "",
    userName: "",
    userPassword: "",
    confirmPassword: "", 
    tel1: "",
    tel2: "",
    tel3: ""
  });

  // 입력값 변경 함수
  const Change = (e) => {
    const { name, value } = e.target;
    setJoinData((prev) => ({ ...prev, [name]: value }));
  };

  // 회원가입 버튼 클릭 시
  const handleJoin = () => {
    const { userEmail, userPassword, tel1, tel2, tel3, userName } = joinData;
  
    const userTel = `${tel1}-${tel2}-${tel3}`;
  
    // 이메일 형식 정규식
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // 비밀번호 정규식 (영문, 숫자 포함 6자 이상)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    // 전화번호 숫자만 검사
    const telRegex = /^\d+$/;
  
    // 유효성 검사
    if (!emailRegex.test(userEmail)) {
      alert("올바른 이메일 형식을 입력해주세요.");
      return;
    }
  
    if (!passwordRegex.test(userPassword)) {
      alert("비밀번호는 영문+숫자 포함 6자리 이상이어야 합니다.");
      return;
    }
    //비밀번호 중복 유효성 검사 
    if (joinData.userPassword !== joinData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
  
    if (!tel1 || !tel2 || !tel3 || !telRegex.test(tel1) || !telRegex.test(tel2) || !telRegex.test(tel3)) {
      alert("전화번호를 숫자로 정확히 입력해주세요.");
      return;
    }
  
    const dataToSend = {
      userEmail,
      userName,
      userPassword,
      userTel
    };
  
    joinUser(dataToSend)
      .then((res) => {
        console.log("회원가입 성공:", res.data);
        alert("회원가입이 완료되었습니다!");
      })
      .catch((e) => {
        console.error("회원가입 실패:", e);
        alert("회원가입 중 오류가 발생했습니다.");
      });
  };
  

  return (
    <div className={styles.container}>
      <h1>회원가입</h1>
      <div className={styles.body}>
        <p>이메일*</p>
        <input
          type="text"
          name="userEmail"
          placeholder="이메일을 입력하세요"
          value={joinData.userEmail}
          onChange={Change}
        />
        

        <p>닉네임*</p>
        <input
          type="text"
          name="userName"
          placeholder="닉네임 입력"
          value={joinData.userName}
          onChange={Change}
        />

        <p>비밀번호*</p>
        <input
          type="password"
          name="userPassword"
          placeholder="영문+숫자6자리 이상 입력하세요"
          value={joinData.userPassword}
          onChange={Change}
        />

        <p>비밀번호 확인*</p>
        <input
          type="password"
          name="confirmPassword" // 👈 추가
          placeholder="비밀번호를 한번 더 입력하세요"
          value={joinData.confirmPassword}
          onChange={Change}
        />
        

        <p>성별</p>
        <div>
          <label>
            <input type="radio" name="gender" value="male" /> 남자
          </label>
          <label>
            <input type="radio" name="gender" value="female" /> 여자
          </label>
        </div>

        <p>전화번호</p>
        <div className={styles["phone-inputs"]}>
          <input
            type="text"
            name="tel1"
            maxLength="3"
            value={joinData.tel1}
            onChange={Change}
          /> -
          <input
            type="text"
            name="tel2"
            maxLength="4"
            value={joinData.tel2}
            onChange={Change}
          /> -
          <input
            type="text"
            name="tel3"
            maxLength="4"
            value={joinData.tel3}
            onChange={Change}
          />
        </div>

        <button
          type="button"
          className={styles.joinButton}
          onClick={handleJoin}
        >
          회원가입
        </button>
      </div>
    </div>
  );
};

export default Join;
