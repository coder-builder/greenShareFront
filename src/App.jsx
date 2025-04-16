import "./App.css";
import { Route, Routes, Router } from "react-router-dom";
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
import Login from "./components/farmercom/Login";
import Join from "./components/farmercom/Join";
import TempDetail from "./components/farmercom/detailboard/TempDetail";
import LuxDetail from "./components/farmercom/detailboard/LuxDetail";
import HumidDetail from "./components/farmercom/detailboard/HumidDetail";
import SoilDetail from "./components/farmercom/detailboard/SoilDetail";
import FarmerCommunity from "./components/farmercom/FarmerCommunity";
import UserQnaInsert from "./components/user/UserQnaInsert";
import FarmerCommunityInsert from "./components/farmercom/FarmerCommunityInsert";
import FarmerCommunityDetail from "./components/farmercom/FarmerCommunityDetail";
import FarmerCommunityUpdate from "./components/farmercom/FarmerCommunityUpdate";
import MainPage from "./components/farmercom/main/MainPage";
import MyPage from "./components/farmercom/MyPage";
import Follow from "./components/farmercom/Follow";

import ProtectedRoute from "./components/farmercom/ProtectedRoute";
import ProtectedAdminRoute from "./components/farmercom/ProtectedAdminRoute";


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
          {/* -------- 구분선 -------- */}
          {/* OutLet으로 이동할 페이지 */}

          {/* 마이 페이지 */}
          <Route path="mypage" element={<MyPage />} />
          {/* 마이 페이지 */}
          <Route path="follow" element={<Follow />} />

          {/* 목록 페이지 */}
          <Route path="/" element={<MainPage />} />

          <Route path="plants" element={<FarmerPlantList />} />
          {/* 상세페이지 */}
          <Route
            path="/plant/:id"
            element={
              <ProtectedRoute>
                <FarmerPlantDetail />
              </ProtectedRoute>
            }
          />

          {/* 각 작물 상세 온도 */}
          {/* 관리자만 접근 허용 */}
          <Route
            path="/plant/:id/temperature"
            element={
              <ProtectedAdminRoute>
                <TempDetail />
              </ProtectedAdminRoute>
            }
          />

          {/* 각 작물 상세 조도 */}
          {/* 관리자만 접근 허용 */}
          <Route
            path="/plant/:id/illuminance"
            element={
              <ProtectedAdminRoute>
                <LuxDetail />
              </ProtectedAdminRoute>
            }
          />

          {/* 각 작물 상세 습도 */}
          {/* 관리자만 접근 허용 */}
          <Route
            path="/plant/:id/humidity"
            element={
              <ProtectedAdminRoute>
                <HumidDetail />
              </ProtectedAdminRoute>
            }
          />

          {/* 각 작물 상세 토양 수분 */}
          {/* 관리자만 접근 허용 */}
          <Route
            path="/plant/:id/soilMoisture"
            element={
              <ProtectedAdminRoute>
                <SoilDetail />
              </ProtectedAdminRoute>
            }
          />

          {/* 구분선 */}
          {/* 여기서부터 공지사항 & QnA게시판*/}
          {/* 공지사항 */}
          <Route path="noti" element={<FarmerNoti />} />

          {/* 공지사항 세부조회 */}

          <Route path="/noti/:num" element={<FarmerNotiDetail />} />
          {/* 공지사항 */}
          <Route path="/FarmerNotiInsert" element={<FarmerNotiInsert />} />
          {/* QnA게시판 */}
          <Route path="/qna/:num" element={<UserQnaDetail />} />
          {/* QnA등록 */}
          <Route path="/qnaInsert" element={<UserQnaInsert />} />

          <Route path="/userQnaInsert" element={<UserQnaInsert />} />

          {/* 구분선 */}
          {/* 로그인 페이지 */}
          <Route path="login" element={<Login />} />

          {/* 회원가입 페이지 */}
          <Route path="join" element={<Join />} />

          {/* 식물 이야기 페이지 */}
          <Route path="/community" element={<FarmerCommunity />} />
          <Route path="/reg-community" element={<FarmerCommunityInsert />} />
          <Route
            path="/detail-community/:boardNum"
            element={<FarmerCommunityDetail />}
          />
          <Route
            path="/update-community/:boardNum"
            element={<FarmerCommunityUpdate />}
          />
        </Route>

        {/* -------- 구분선 -------- */}
        {/* 관리자가 접속하는 화면 */}
        <Route path="/admin" element={<AdminMain isVisible={viewSide} />}>
          {/* OutLet으로 이동할 페이지 */}
          <Route path="insertplant" element={<AdminPlantInsert />} />
          <Route path="test" element={<Dashboard />} />
          <Route />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
