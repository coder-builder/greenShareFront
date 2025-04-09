import "./App.css";
import { Route, Routes } from "react-router-dom";
import FarmerMain from "./components/farmercom/FarmerMain";
import AdminMain from "./components/admincom/AdminMain";
import FarmerPlantList from "./components/farmercom/FarmerPlantList";
import FarmerPlantDetail from "./components/farmercom/FarmerPlantDetail";
import AdminPlantInsert from "./components/admincom/AdminPlantInsert";
import FarmerNoti from "./components/farmercom/FarmerNoti";
import { useEffect, useState } from "react";
import Dashboard from "./components/farmercom/Dashboard";
import FarmerNotiInsert from "./components/farmercom/FarmerNotiInsert";
import FarmerNotiDetail from "./components/farmercom/FarmerNotiDetail";
import UserQna from "./components/user/UserQna";
import UserQnaDetail from "./components/user/UserQnaDetail";

function App() {
  const [viewSide, setSide] = useState(false);
  const handleOn = (e) => {
    /* 마우스의 위치를 판단하는 함수 */
    if (e.clientX < 200) {
      setSide(true);
    } else {
      setSide(false);
    }
  };
  useEffect(() => {
    /* 마우스의 움직임을 감지하는 이벤트 리스너 */
    window.addEventListener("mousemove", handleOn);

    return () => {
      window.removeEventListener("mousemove", handleOn);
    };
  }, []);

  return (
    <div className="appCon">
      {/* 홈화면 */}
      <Routes>
        {/* -------- 구분선 -------- */}
        {/* 농부가 접속하는 화면 */}
        <Route path="/" element={<FarmerMain isVisible={viewSide} />}>
          {/* OutLet으로 이동할 페이지 */}
          <Route path="plants" element={<FarmerPlantList />} />
          <Route path="plant" element={<FarmerPlantDetail />} />
          <Route path="noti" element={<FarmerNoti/>} />
          <Route path='/noti/:num' element={<FarmerNotiDetail/>}/>
          <Route path='/FarmerNotiInsert' element={<FarmerNotiInsert/>}/>
          <Route path='/qna' element={<UserQna/>}/>
          <Route path='/qna/:num' element={<UserQnaDetail/>}/>

        </Route>

        {/* -------- 구분선 -------- */}
        {/* 관리자가 접속하는 화면 */}
        <Route path="/admin" element={<AdminMain isVisible={viewSide} />}>
          {/* OutLet으로 이동할 페이지 */}
          <Route path="insertplant" element={<AdminPlantInsert />} />
          <Route path="test" element={<Dashboard/>}/>
          <Route />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
