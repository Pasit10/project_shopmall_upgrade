import { ShoppingCart, Menu, Search } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { User as UserIcon } from "lucide-react";
import User from '../../src/Type/User'
import axios from "axios";
import axiosInstant from '../utils/axios';

const Navbar = () => {
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axiosInstant.get("/user/me", {withCredentials:true});
                setUser(response.data); // Store user data
                console.log("User fetched:", response.data);
            } catch (error) {
                console.error("Error fetching user:", error);
                setUser(null)
            }
        };

        fetchUser();
    }, []);

    const Logout = async () => {
        try {
            const response = await axios.get("/logout", { withCredentials: true });

            if (response.status === 200) {
                setUser(null);
                navigate("/");
            }
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };
    return (
        <nav className="navbar navbar-expand-lg bg-white shadow-sm sticky-top">
            <div className="container">
                <a className="navbar-brand fw-bold fs-4" href="#">LUXE</a>
                <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <Menu size={24} />
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item"><button className="nav-link fw-medium btn btn-link" onClick={() => navigate("/")}>Home</button></li>
                        <li className="nav-item"><button className="nav-link fw-medium btn btn-link" onClick={() => navigate("/shop")}>Shop</button></li>
                        <li className="nav-item"><button className="nav-link fw-medium btn btn-link" onClick={() => navigate("/categories")}>Categories</button></li>
                        <li className="nav-item"><a className="nav-link fw-medium" href="#">About</a></li>
                        <li className="nav-item"><a className="nav-link fw-medium" href="#">Contact</a></li>
                    </ul>
                    <div className="d-flex align-items-center">
                        <button className="btn btn-link text-dark p-2">
                            <Search size={25} />
                        </button>
                        <button className="btn btn-link text-dark p-2 position-relative">
                            <ShoppingCart size={25} />
                        </button>

                        {user == null ? (
                            <button className="btn btn-outline-dark ms-3" onClick={() => navigate("/login")}>Login</button>
                        ) : (
                            <div className="dropdown ms-3">
                                <button className="btn btn-dark dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                    <UserIcon className="w-6 h-6" />
                                    {user.name} {/* Directly use user.name */}
                                </button>
                                <ul className="dropdown-menu">
                                    <li><button className="dropdown-item" onClick={() => navigate("/profile")}>Profile</button></li>
                                    <li><button className="dropdown-item" onClick={() => navigate("/orders")}>Orders</button></li>
                                    <li><button className="dropdown-item" onClick={() => Logout()}>Logout</button></li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
