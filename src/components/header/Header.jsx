import React, { useEffect, useRef, useState } from "react";
import styles from "./Header.module.css";
import { icon } from "../../consts/icons";
import { Link, useNavigate } from "react-router-dom";
import { pic } from "../../consts/pic";

const Header = () => {
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

  return (
    <>
      <div className={styles.mainCon}>
        {/* 메인 콘테이너 */}

        <span
          className={[
            styles.green /* 컬러 그린 */,
            styles.fontBold /* 폰트 굵게 */,
            styles.font15rem /* 폰트 사이즈 1.5REM */,
            styles.cursor /* 마우스 호버시 커서 */,
          ].join(" ")}
          onClick={() => {
            /* 온클릭시 메인 페이지로 이동 */
            nav("/");
          }}
        >
          <img src={pic.logo} />
          {/* 로고 이미지 */}
        </span>

        {/* 여기서부터 오른쪽 카테고리 컨테이너 */}
        <div className={styles.cateCon}>
          {/* 작물 리스트 */}
          <span
            onClick={() => {
              /* 클릭시 작물리스트로 이동 */
              nav("/plants");
            }}
            className={[styles.cursor, styles.darkGrey /* 컬러 그린 */].join(
              " "
            )}
          >
            작물 리스트
          </span>

          <span
            className={[styles.cursor, styles.darkGrey /* 컬러 그린 */].join(
              " "
            )}
            onClick={(e)=>{
              nav('/community')
            }}
          >
            커뮤니티
          </span>
          <span
            className={[styles.cursor, styles.darkGrey /* 컬러 그린 */].join(
              " "
            )}
          >
            공지사항
          </span>

          <span
            onClick={() => {
              nav("/login");
            }}
            className={[styles.cursor, styles.darkGrey /* 컬러 그린 */].join(
              " "
            )}
          >
            로그인
          </span>
        </div>
      </div>
    </>
  );
};

export default Header;
