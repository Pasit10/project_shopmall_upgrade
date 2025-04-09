import { ShoppingCart, Menu, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { User as UserIcon } from "lucide-react";
import User from "../Types/User";
import axiosInstant from "../utils/axios";
import React from "react";
import AddressModal from "./AddressModal"; // Import the separate modal component

const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const isUserfetched = useRef(false);
  const [isAdminBtnOpen, setIsAdminBtnOpen] = useState(false);
  const [isSuperAdminBtnOpen, setIsSuperAdminBtnOpen] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [modalData, setModalData] = useState({
    address: '',
    tel: ''
  });

  const fetchUser = useCallback(async () => {
    if (isUserfetched.current) return;
    try {
      const response = await axiosInstant.get("/user/me", {
        withCredentials: true,
      });
      if (response.status === 200) {
        if (response.data.role === "admin") {
            setIsAdminBtnOpen(true);
        }
        if (response.data.role === "superadmin") {
            setIsAdminBtnOpen(true);
            setIsSuperAdminBtnOpen(true);
        }
        setUser(response.data);

        // Check if address or tel is empty and show modal
        if (response.data.address === "" || response.data.tel === "") {
          setModalData({
            address: response.data.address || '',
            tel: response.data.tel || ''
          });
          setShowAddressModal(true);
        }

        isUserfetched.current = true;
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const Logout = useCallback(async () => {
    try {
      const response = await axiosInstant.get("/auth/logout", {
        withCredentials: true,
      });
      if (response.status === 200) {
        setUser(null);
        navigate("/");
      }
    } catch (error) {
      console.error("Logout Error:", error);
    }
  }, [navigate]);

  // Handle saving user data from modal
  const handleSaveUserData = (updatedData: { address: string; tel: string }) => {
    setUser(prev => prev ? {...prev, ...updatedData} : null);
    setShowAddressModal(false);
  };

  const userDropdown = useMemo(() => {
    if (!user) {
      return (
        <button
          className="btn btn-link-dark d-flex align-items-center justify-content-center"
          onClick={() => navigate("/login")}
        >
          <UserIcon className="me-1" />
          Login
        </button>
      );
    }
    return (
      <div className="dropdown ms-3">
        <button
          className="btn btn-dark dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
        >
          <UserIcon className="w-6 h-6" />
          {user.name}
        </button>
        <ul className="dropdown-menu dropdown-menu-end">
          <li>
            <button
              className="dropdown-item"
              onClick={() => navigate("/profile")}
            >
              Profile
            </button>
          </li>
          {isAdminBtnOpen && (
            <li>
              <button
                className="dropdown-item"
                onClick={() => navigate("/admin")}
              >
                Admin
              </button>
            </li>
          )}
          {isSuperAdminBtnOpen && (
            <li>
              <button
                className="dropdown-item"
                onClick={() => navigate("/superadmin")}
              >
                SuperAdmin
              </button>
            </li>
          )}
          <li>
            <button className="dropdown-item" onClick={Logout}>
              Logout
            </button>
          </li>
        </ul>
      </div>
    );
  }, [user, isAdminBtnOpen, Logout, navigate]);

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-white shadow-sm sticky-top w-100 px-5">
        <a className="navbar-brand fw-bold fs-4" href="/">
          LUXE
        </a>
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <Menu size={24} />
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <button
                className="nav-link fw-medium btn btn-link"
                onClick={() => navigate("/")}
              >
                Home
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link fw-medium btn btn-link"
                onClick={() => navigate("/shop")}
              >
                Shop
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link fw-medium btn btn-link"
                onClick={() => navigate("/categories")}
              >
                Categories
              </button>
            </li>
            <li className="nav-item">
              <a className="nav-link fw-medium" href="#">
                About
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link fw-medium" href="#">
                Contact
              </a>
            </li>
          </ul>
          <div className="d-flex align-items-center">
            <button className="btn btn-link text-dark p-2">
              <Search size={25} />
            </button>
            <button
              className="btn btn-link text-dark p-2 position-relative"
              onClick={() => navigate("/cart")}
            >
              <ShoppingCart size={25} />
            </button>
            {userDropdown}
          </div>
        </div>
      </nav>
      
      {/* Use the imported address modal component */}
      <AddressModal 
        show={showAddressModal}
        onClose={() => navigate("/profile")}
        initialData={modalData}
        onSave={handleSaveUserData}
      />
    </>
  );
};

export default React.memo(Navbar);