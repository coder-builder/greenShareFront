import React from "react";

import { Outlet } from "react-router-dom";
import Header from "../header/Header";
import SideBar from "../side/SideBar";

const FarmerMain = ({ isVisible }) => {
  return (
    /* 농부 메인페이지 */
    <div>
      <div>
        <Header />
      </div>
      <div>
        <Outlet />
        <SideBar isVisible={isVisible} />
        
      </div>
    </div>
  );
};

export default FarmerMain;



