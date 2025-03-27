import React, { useEffect, useRef, useState } from "react";
import styles from "./Header.module.css";
import { icon } from "../../consts/icons";
import { useNavigate } from "react-router-dom";

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
        <span
          className={[
            styles.green,
            styles.fontBold,
            styles.font15rem,
            styles.cursor,
          ].join(" ")}
          onClick={() => {
            nav("/");
          }}
        >
          GREENSHARE
        </span>
        <div className={styles.cateCon}>
          <span
            onClick={() => {
              nav("/plants");
            }}
            className={styles.cursor}
          >
            내작물
          </span>
          <span className={styles.cursor}>커뮤니티</span>
          <span className={styles.cursor}>공지사항</span>
          <span className={styles.cursor}>로그인</span>
          <span
            onClick={toggleMenu}
            className={[styles.grey, styles.icon].join(" ")}
          >
            <img src={icon.accout} />
          </span>

          {/* 로그인 되었을 땐 이걸로 나오게 */}
        </div>
      </div>
    </>
  );
};

export default Header;
