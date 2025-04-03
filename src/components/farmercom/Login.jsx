import React from 'react'
import styles from "./Login.module.css";
import { Link } from 'react-router-dom';
const Login = () => {
  return (
    /* 로그인 페이지 */
    <>
    
    <div className={styles.container}>
      <div className={styles.title}>
        <h1>LOGIN</h1>
        <p>식물에대한다양한 이야기와 정보를 공유해보세요.</p>
      </div>

      <div className={styles.input}>
        <input  type="text" placeholder='이메일을 입력하세요' />
        <input type="text" placeholder='비밀번호를 입력하세요' />
      </div>
      
      <Link to={'/join'}>
      <div>회원가입</div>
      </Link>

      <div>
        <button type='button' className={styles.button}>로그인</button>
      </div>



    </div>


      
    
    
    </>
  )
}

export default Login