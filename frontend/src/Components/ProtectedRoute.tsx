import React from "react";
import { Navigate } from "react-router-dom";
import { CurrentUser, UserRole } from "../Types/CurrentUser";

// Props ของ ProtectedRoute
interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: UserRole | UserRole[];
  currentUser: CurrentUser | null;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role, currentUser }) => {
  // const navigate = useNavigate

  console.log("user is",currentUser)
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const userRole = currentUser.role;

  if (
    role &&
    ((Array.isArray(role) && !role.includes(userRole)) ||
      (!Array.isArray(role) && userRole !== role))
  ) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;  // แสดง children ที่ส่งเข้ามา
};

export default ProtectedRoute;
