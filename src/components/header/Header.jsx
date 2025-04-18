import React, { useEffect, useRef, useState } from "react";
import styles from "./Header.module.css";
import { icon } from "../../consts/icons";
import { Link, useNavigate } from "react-router-dom";
import { pic } from "../../consts/pic";
import { useDispatch, useSelector } from "react-redux";
import { logoutReducer } from "../../redux/authSlice";

const Header = () => {
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const nav = useNavigate();
  /* 열림 닫힘 상태 */
  const [isOpen, setIsOpen] = useState(false);
  /* 외부를 클릭을 감지할 ref */
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setIsOpen(false); // 메뉴 외부 클릭 시 메뉴 닫음
    }
  };

  useEffect(() => {
    // 이벤트 리스너로 클릭 외부 감지
    document.addEventListener("mousedown", handleClickOutside);

    // 컴포넌트가 언마운트 될 때 이벤트 리스너 정리
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const goToNoti = () => {
    if (!token) {
      // 로그인 안 했으면 로그인 페이지로 리다이렉트
      nav("/login");
      alert("로그인 후 이용 가능합니다.");  
    } else {
      // 로그인 됐으면 공지사항 페이지로 이동
      nav("/noti");
    }
  };
  
  

  return (
    <>
      <div className={styles.mainCon}>
        {/* 메인 콘테이너 */}

        <span
          className={[
            styles.cateCon,
            /* 마우스 호버시 커서 */
          ].join(" ")}
        >
          {/* 로고 이미지 */}
          <div className={styles.logoCon}>
            <img
              src={pic.logo}
              onClick={() => {
                /* 온클릭시 메인 페이지로 이동 */
                nav("/");
              }}
              className={styles.logoImg}
            />
          </div>
        </span>

        {/* 여기서부터 오른쪽 카테고리 컨테이너 */}
        <div className={styles.cateCon}>
          {/* 작물 리스트 */}
          <span
            onClick={() => {
              /* 클릭시 작물리스트로 이동 */
              nav("/plants");
            }}
            className={[styles.cursor, styles.darkGrey, styles.fontWidth].join(
              " "
            )}
          >
            작물 리스트
          </span>

          <span
            className={[styles.cursor, styles.darkGrey, styles.fontWidth].join(
              " "
            )}
            onClick={(e) => {
              nav("/community");
            }}
          >
            커뮤니티
          </span>
          <span
            className={[
              styles.cursor,
              styles.darkGrey,
              styles.fontWidth,
              /* 컬러 그린 */
            ].join(" ")}
            onClick={goToNoti} 
          >
            공지사항
          </span>
          <span
            className={[styles.cursor, styles.darkGrey, styles.fontWidth].join(
              " "
            )}
            onClick={(e) => {
              nav("/qna");
            }}
          >
            공지사항
          </span>
          {token === null ? (
            <span
              onClick={() => nav("/login")}
              className={`${styles.cursor} ${styles.darkGrey} ${styles.fontWidth}`}
            >
              로그인
            </span>
            ) : (
            <>
              <span
                className={`${styles.cursor} ${styles.darkGrey} ${styles.fontWidth}`}
                onClick={() => nav("/follow")}
              >
                팔로우 목록
              </span>

              <span
                className={`${styles.cursor} ${styles.darkGrey} ${styles.fontWidth}`}
                onClick={() => {
                  const confirmLogout = window.confirm("로그아웃 하시겠습니까?");
                  if (confirmLogout) {
                    dispatch(logoutReducer());
                  }
                }}
              >
                로그아웃 {user?.userName && `(${user.userName})`}
              </span>
            </>
          )}

        </div>
      </div>
    </>
  );
};

export default Header;
