import React from "react";
import AdminHeader from "./AdminHeader";
import { Outlet } from "react-router-dom";

const AdminMain = () => {
  return (/* 관리자 메인 */
    <div>
      <div>
        <AdminHeader />
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminMain;
