import React from "react";

import { Outlet } from "react-router-dom";
import Header from "../header/Header";
import SideBar from "../side/SideBar";

const AdminMain = ({isVisible}) => {
  return (
    /* 관리자 메인 */
    <div>
      <div>
        <Header />
        <SideBar isVisible={isVisible}/>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminMain;
