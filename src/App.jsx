import "./App.css";
import { Route, Routes } from "react-router-dom";
import FarmerMain from "./components/farmercom/FarmerMain";
import AdminMain from "./components/admincom/AdminMain";
import FarmerPlantList from "./components/farmercom/FarmerPlantList";
import FarmerPlantDetail from "./components/farmercom/FarmerPlantDetail";
import AdminPlantInsert from "./components/admincom/AdminPlantInsert";
import FarmerNoti from "./components/farmercom/FarmerNoti";

function App() {
  return (
    <>
      {/* 홈화면 */}
      <Routes>
        {/* -------- 구분선 -------- */}
        {/* 농부가 접속하는 화면 */}
        <Route path="/" element={<FarmerMain />}>
          {/* OutLet으로 이동할 페이지 */}
          <Route path="plants" element={<FarmerPlantList />} />
          <Route path="plant" element={<FarmerPlantDetail />} />
          <Route path="noti" element={<FarmerNoti />} />
        </Route>

        {/* -------- 구분선 -------- */}
        {/* 관리자가 접속하는 화면 */}
        <Route path="/admin" element={<AdminMain />}>
          {/* OutLet으로 이동할 페이지 */}
          <Route path="insertplant" element={<AdminPlantInsert />} />
          <Route />
          <Route />
        </Route>
      </Routes>
    </>
  );
}

export default App;
