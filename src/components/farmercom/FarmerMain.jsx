import React from "react";
import FarmerHeader from "./FarmerHeader";
import { Outlet } from "react-router-dom";

const FarmerMain = () => {
  return (/* 농부 메인페이지 */
    <div>
      <div>
        <FarmerHeader />
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default FarmerMain;
