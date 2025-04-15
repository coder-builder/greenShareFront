import React, { useState } from "react";
import styles from "./Login.module.css";

import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../redux/axiosinstance";
import { useDispatch } from "react-redux";
import { loginReducer } from "../../redux/authSlice";
import { jwtDecode } from "jwt-decode";
import { icon } from "./../../consts/icons";

const Login = () => {
  const dispatch = useDispatch();
  const nav = useNavigate();

  const [login, setLogin] = useState({
    userEmail: "",
    userPassword: "",
  });

  const handleLogin = async () => {
    axiosInstance
      .post("/users/login", login)
      .then((res) => {
        alert("로그인 성공");

        const token = res.headers["authorization"];
        const user = jwtDecode(token); // 토큰에서 유저 정보 추출

        dispatch(
          loginReducer({
            token,
            user,
          })
        );

        nav("/");
      })
      .catch((e) => {
        if (e.response?.status === 401) {
          alert("로그인 실패");
        } else {
          console.log(e);
        }
      });
  };

  const changeLogin = (e) => {
    setLogin({
      ...login,
      [e.target.name]: e.target.value,
    });
  };

  return (
    /* 로그인 페이지 */
    <>
      <div className={styles.container}>
        <div className={styles.title}>
          <h1>LOGIN</h1>
          <p>식물에 대한 다양한 이야기와 정보를 공유해보세요.</p>
        </div>

        <div className={styles.input}>
          <div className={styles.passBox}>
            <img src={icon.person} alt="" />
            <input
              type="text"
              placeholder="이메일을 입력하세요"
              name="userEmail"
              value={login.userEmail}
              onChange={(e) => {
                changeLogin(e);
              }}
            />
          </div>

          <div className={styles.passBox}>
            <img src={icon.lock} alt="" />
            <input
              type="password"
              placeholder="비밀번호를 입력하세요"
              name="userPassword"
              value={login.userPassword}
              onChange={(e) => {
                changeLogin(e);
              }}
            />
          </div>
        </div>

        <div
          onClick={() => {
            nav("/join");
          }}
          className={styles.cursor}
        >
          회원가입
        </div>

        <div>
          <button
            type="button"
            className={styles.button}
            onClick={() => {
              handleLogin();
            }}
          >
            로그인
          </button>
        </div>
      </div>
    </>
  );
};

export default Login;
