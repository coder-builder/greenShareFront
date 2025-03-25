import React from "react";

import { Outlet } from "react-router-dom";
import Header from "../header/Header";

const AdminMain = () => {
  return (
    /* 관리자 메인 */
    <div>
      <div>
        <Header />
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminMain;
