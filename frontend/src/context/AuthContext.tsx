import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstant from "../utils/axios"; // <-- ปรับ path ตามโปรเจกต์คุณเอง
import { CurrentUser } from "../Types/CurrentUser";

// ประเภทของ AuthContext
interface AuthContextType {
  currentUser: CurrentUser | null;
  setCurrentUser: (user: CurrentUser | null) => void;
}

// สร้าง context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook ที่ใช้ใน component อื่น
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// AuthProvider ครอบ App
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  const getUserProfile = async () => {
    try {
      const response = await axiosInstant.get("/user/me", {
        withCredentials: true,
      });
      setCurrentUser(response.data);
    } catch (error) {
      console.error("❌ Failed to fetch user profile:", error);
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};
