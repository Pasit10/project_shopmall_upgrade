import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosInstant from "../utils/axios";
import React, { useCallback } from "react";

const TopBar: React.FC = () => {
  const navigate = useNavigate();

  const Logout = useCallback(async () => {
    try {
      const response = await axiosInstant.get("/auth/logout", {
        withCredentials: true,
      });
      if (response.status === 200) {
        navigate("/");
      }
    } catch (error) {
      console.error("Logout Error:", error);
    }
  }, [navigate]);

  return (
    <div className="bg-white px-4 py-3 d-flex justify-content-end align-items-center">
      <button
        className="btn btn-link text-dark p-2 position-relative"
        onClick={Logout}
      >
        <LogOut className="me-1" size={20} />
      </button>
    </div>
  );
};

export default TopBar;
