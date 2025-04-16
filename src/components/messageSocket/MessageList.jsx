import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../redux/axiosInstance";

const MessageList = () => {

  const[message, setMessage] = useState([])

  useEffect(()=>{
    axiosInstance.get('/notes')
    .then((res)=>{setMessage(res.data)})
    .catch((error)=>{console.log(error)})
  },[])

  return (
    <>
      <div>
        <h3>나의 쪽지함</h3>
        {
          message.map((note,i)=>{
            return(
             <div key={i}>
                <div>{note.id}</div>
                <div>{note.senderEmail}</div>
                <div>{note.receiverEmail}</div>
                <div>{note.content}</div>
                <div>{note.sentAt}</div>
             </div>
            )
          })
        }
      </div>
     
    </>
  );
};

export default MessageList;
