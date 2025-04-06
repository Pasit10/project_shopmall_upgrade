// import { ShoppingCart, Menu, Search } from 'lucide-react';
// import { useNavigate } from "react-router-dom";
// import { useEffect, useRef, useState, useCallback, useMemo } from "react";
// import { User as UserIcon } from "lucide-react";
// import User from '../Types/User';
// import axiosInstant from '../utils/axios';
// import React from "react";

// const Navbar = () => {
//     const [user, setUser] = useState<User | null>(null);
//     const navigate = useNavigate();
//     const isUserfetched = useRef(false);

//     const fetchUser = useCallback(async () => {
//         if (isUserfetched.current) return;
//         try {
//             const response = await axiosInstant.get("/user/me", { withCredentials: true });
//             if (response.status === 200) {
//                 setUser(response.data);
//                 isUserfetched.current = true;
//             }
//         } catch (error) {
//             console.error("Error fetching user:", error);
//             setUser(null);
//         }
//     }, []);

//     useEffect(() => {
//         fetchUser();
//     }, [fetchUser]);

//     const Logout = useCallback(async () => {
//         try {
//             const response = await axiosInstant.get("/auth/logout", { withCredentials: true });
//             if (response.status === 200) {
//                 setUser(null);
//                 navigate("/");
//             }
//         } catch (error) {
//             console.error("Logout Error:", error);
//         }
//     }, [navigate]);

//     const userDropdown = useMemo(() => {
//         if (!user) {
//             return (
//                 <button
//                     className="btn btn-link-dark d-flex align-items-center justify-content-center"
//                     onClick={() => navigate("/login")}
//                 >
//                     <UserIcon className="me-1" />
//                     Login
//                 </button>
//             );
//         }
//         return (
//             <div className="dropdown ms-3">
//                 <button className="btn btn-dark dropdown-toggle" type="button" data-bs-toggle="dropdown">
//                     <UserIcon className="w-6 h-6" />
//                     {user.name}
//                 </button>
//                 <ul className="dropdown-menu dropdown-menu-end">
//                     <li>
//                         <button className="dropdown-item" onClick={() => navigate("/profile")}>Profile</button>
//                     </li>
//                     <li>
//                         <button className="dropdown-item" onClick={() => navigate("/orders")}>Orders</button>
//                     </li>
//                     <li>
//                         <button className="dropdown-item" onClick={Logout}>Logout</button>
//                     </li>
//                 </ul>
//             </div>
//         );
//     }, [user, Logout, navigate]);

//     return (
//         <nav className="navbar navbar-expand-lg bg-white shadow-sm sticky-top w-100 px-5">
//             <a className="navbar-brand fw-bold fs-4" href="/">LUXE</a>
//             <button
//                 className="navbar-toggler border-0"
//                 type="button"
//                 data-bs-toggle="collapse"
//                 data-bs-target="#navbarNav"
//             >
//                 <Menu size={24} />
//             </button>
//             <div className="collapse navbar-collapse" id="navbarNav">
//                 <ul className="navbar-nav me-auto">
//                     <li className="nav-item">
//                         <button className="nav-link fw-medium btn btn-link" onClick={() => navigate("/")}>Home</button>
//                     </li>
//                     <li className="nav-item">
//                         <button className="nav-link fw-medium btn btn-link" onClick={() => navigate("/shop")}>Shop</button>
//                     </li>
//                     <li className="nav-item">
//                         <button className="nav-link fw-medium btn btn-link" onClick={() => navigate("/categories")}>Categories</button>
//                     </li>
//                     <li className="nav-item">
//                         <a className="nav-link fw-medium" href="#">About</a>
//                     </li>
//                     <li className="nav-item">
//                         <a className="nav-link fw-medium" href="/admin" >Admin</a>
//                     </li>
//                 </ul>
//                 <div className="d-flex align-items-center">
//                     <button className="btn btn-link text-dark p-2">
//                         <Search size={25} />
//                     </button>
//                     <button
//                         className="btn btn-link text-dark p-2 position-relative"
//                         onClick={() => navigate("/cart")}
//                     >
//                         <ShoppingCart size={25} />
//                     </button>
//                     {userDropdown}
//                 </div>
//             </div>
//         </nav>
//     );
// };

// export default React.memo(Navbar);
