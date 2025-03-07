import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import axiosInstant from "../utils/axios";
// import {axios} from 'axios'
import "bootstrap/dist/css/bootstrap.min.css";


const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleEmailLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      // const response = await fetch("http://10.42.14.139:3000/login", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email, password }),
      // });

      const response = await axiosInstant.post("/login", {email, password}, {withCredentials:true})

      if (response.status === 200) {
        navigate("/");
      } else {
        setError("Invalid email or password.");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
        console.error("Login error:", error.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  const handleGoogleLoginSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    try {
      // const response = await fetch("http://10.42.14.139:3000/auth/google", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ token: credentialResponse.credential }),
      // });
      const { credential } = credentialResponse

      const response = await axiosInstant.post("/google/login", { token: credential }, { withCredentials:true})

      // const data = await response.json();

      if (response.status === 200) {
        // console.log("Google Login successful", data);
        navigate("/");
      } else {
        setError(response.data || "Google Login failed.");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
        console.error("Google Login error:", error.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  return (
    <>
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
      >
      <div className="card p-4" style={{ width: "350px" }}>
        <h3 className="text-center">Login</h3>
        {error && <div className="alert alert-danger">{error}</div>}

        {/* 🔹 Form Login ด้วย Email/Password */}
        <form onSubmit={handleEmailLogin}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>

        {/* 🔹 ปุ่ม Login ด้วย Google */}
        <div className="mt-3 text-center">
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={() => setError("Google Login Failed")}
            />
        </div>
        <div className="mt-3 d-flex justify-content-center">
          <button
            type="button"
            className="btn btn-link px-0 text-decoration-none fs-5"
            onClick={() => navigate("/register")}
            >
            Register
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default LoginPage;
