import React from "react";

import { Outlet } from "react-router-dom";
import Header from "../header/Header";
import SideBar from "../side/SideBar";

const FarmerMain = () => {
  return (
    /* 농부 메인페이지 */
    <div>
      <div>
        <Header />
        <SideBar />
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default FarmerMain;
