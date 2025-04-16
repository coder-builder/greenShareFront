import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router";
import { isAdmin } from "../../redux/authCheck";
import { useSelector } from "react-redux";

const ProtectedAdminRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token);
  const [isAccessible, setIsAccessible] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    if (!isAdmin(token)) {
      alert("접근할 수 없습니다.");
      setIsAccessible(false);
    } else {
      setIsAccessible(true);
    }
  }, []);

  if (isAccessible === null) return null;
  return isAccessible ? children : <Navigate to={`/plant/${id}`} />;
};

export default ProtectedAdminRoute;
