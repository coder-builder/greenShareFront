import React from 'react'
import { Link } from 'react-router-dom'

const MyPage = () => {
  return (


    <>
      <h1>마이 페이지</h1>

      <Link to={'/follow'}><p>팔로우</p></Link>



    
    </>
  )
}

export default MyPage