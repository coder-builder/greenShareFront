import React, { useEffect, useState } from "react";
import styles from "./FarmerCommunityUpdate.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { detailStory } from "../../apis/plantStory";
import axios from "axios";

const FarmerCommunityUpdate = () => {

  const nav = useNavigate();

  const{boardNum} = useParams();

  //상세 식물 이야기를 가져와서 담는다
  const [updateDetail,setUpdateDetail]= useState({})

  useEffect(()=>{
    detailStory(boardNum)
    .then(res=>setUpdateDetail(res.data))
    .catch(error=>console.log(error))
  },[boardNum])
  
  //기존 상세 식물 이야기를 덮어쓴다
  const handleUpdateData = (e) =>{
    setUpdateDetail({
      ...updateDetail,
      [e.target.name] : e.target.value
    })
  }
 
  return (
      <>
         <div className={styles.container}>
            <div className={styles.title}>
              <p>제목</p>
              <input
                type="text"
                name="title"
                value={updateDetail.title}
                onChange={e => handleUpdateData(e)}
              />
            </div>
            <div className={styles.content}>
              <p>내용</p>
              <textarea
                name="content"
                value={updateDetail.content}
                onChange={e => handleUpdateData(e) }
              ></textarea>
            </div>
          </div>
    
          <div className={styles.btn}>
            <button type="button" onClick={e => nav("/community")}>
              목록 가기
            </button>
            <button type="button" onClick={(e)=>{
              if(updateDetail.title === '' || updateDetail.content === ''){
                alert('제목과 내용을 입력하세요')
                return;
              }
              axios.put(`/api/plantStories/${boardNum}`, updateDetail)
              .then((res)=>{
                alert('수정이 완료되었습니다')
                nav(`/detail-community/${boardNum}`)
              })
              .catch(error => console.log(error))
            }}>
              수정 완료
            </button>
          </div>
      </>
  )
};

export default FarmerCommunityUpdate;
