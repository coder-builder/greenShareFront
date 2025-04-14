import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import styles from "./UserQnaInsert.module.css";

const UserQnaInsert = () => {
  const nav = useNavigate();
  const[insertqna,setInsertqna] = useState({
    writer:'',
    title:'',
    content:''
  });

  const insertChange = (e) =>{
    setInsertqna({
      ...insertqna,
      [e.target.name] : e.target.value
    });
  };

  //게시글 등록기능
  const insertQna = () =>{
    axios.post('api/qna',insertqna)
          .then((res)=>{
            alert('등록성공!')
            nav('/qna')
          })
          .catch((error)=>{
            console.log(error)
          })
  }
  return (
    <>
          <div >
            <table className={styles.mainContainer}>
              <tbody>
                <tr>
                  <td>
                    작성자
                  </td>
                  <td>
                    <input type="text"  name='writer' value={insertqna.writer} onChange={e=>{insertChange(e)}} />
                  </td>
                </tr>
                <tr>
                  <td>
                    제목
                  </td>
                  <td>
                    <input type='text' name='title' value={insertqna.title} onChange={e=>{insertChange(e)}}/>
                  </td>
                </tr>
                <tr>
                  <td>
                    내용
                  </td>
                  <td>
                    <textarea rows={7} cols={23} 
                    type='text' 
                    name='content' 
                    value={insertqna.content} onChange={e=>{insertChange(e)}}/>
                  </td>
                </tr>
              </tbody>
            </table>
            <button type="button" className={styles.insert} onClick={insertQna}>등록하기</button>
          </div>
        </>
  )
}

export default UserQnaInsert