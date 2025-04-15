import React, { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { isAdmin } from "../../redux/authCheck";
import { useSelector } from "react-redux";

const ProtectedAdminRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token);
  const [isAccessible, setIsAccessible] = useState(null);

  useEffect(() => {
    if (!isAdmin(token)) {
      alert("접근할 수 없습니다.\n첫 화면으로 이동합니다.");
      setIsAccessible(false);
    } else {
      setIsAccessible(true);
    }
  }, []);

  if (isAccessible === null) return null;
  return isAccessible ? children : <Navigate to={"/"} />;
};

export default ProtectedAdminRoute;
