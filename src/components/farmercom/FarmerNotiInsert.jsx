import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import styles from "./FarmerNotiInsert.module.css";

const FarmerNotiInsert = () => {
  const nav = useNavigate();
  const[insertNoti,setInsertNoti] = useState({
    writer: '',
    title: '',
    content: ''
  });

  const insertChange = (e) =>{
    setInsertNoti({
      ...insertNoti,
      [e.target.name] : e.target.value
    });
  };

  //게시글 등록기능
  const insertFarmers = () =>{
    axios.post('api/farmers',insertNoti)
          .then((res)=>{
            alert('등록성공!')
            nav('/noti')
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
                <input type="text"  name='writer' value={insertNoti.writer} onChange={e=>{insertChange(e)}} />
              </td>
            </tr>
            <tr>
              <td>
                제목
              </td>
              <td>
                <input type='text' name='title' value={insertNoti.title} onChange={e=>{insertChange(e)}}/>
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
                value={insertNoti.content} onChange={e=>{insertChange(e)}}/>
              </td>
            </tr>
          </tbody>
        </table>
        <button type="button" className={styles.insert} onClick={insertFarmers}>등록하기</button>
      </div>
    </>
  )
}

export default FarmerNotiInsert