import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import validator from "validator";
import axiosInstant from "../utils/axios";
import { GoogleLogin , CredentialResponse } from "@react-oauth/google";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setPasswordError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    if (
      !validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      setError(
        "Password must have at least 8 characters, including uppercase, lowercase, a number, and a symbol."
      );
      return;
    }

    try {
      const response = await axiosInstant.post("/register", {email, password} , {withCredentials:true})

      // const data = await response.json();

      if (response.status === 201) {
        // console.log("Registration successful", data);
        navigate("/login");
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (error) {
      setError("Network error. Please try again later.");
      console.error("Registration error:", error);
    }
  };

  const handleGoogleRegistersSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    try {
      const { credential } = credentialResponse

      const response = await axiosInstant.post("/google/register", { token: credential }, { withCredentials:true})

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

  const validatePassword = (value: string) => {
    setPassword(value);
    if (
      validator.isStrongPassword(value, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      setPasswordError("");
    } else {
      setPasswordError(
        "Password must be at least 8 characters long, include lowercase, uppercase, numbers, and symbols."
      );
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4" style={{ width: "350px" }}>
        <h3 className="text-center">Register</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => validatePassword(e.target.value)}
              required
            />
            {passwordError && (
              <div className="alert alert-warning mt-2">{passwordError}</div>
            )}{" "}
            {/* แสดงข้อผิดพลาดของรหัสผ่าน */}
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Register
          </button>
          <div className="mt-3 text-center">
            <GoogleLogin
              onSuccess={handleGoogleRegistersSuccess}
              onError={() => setError("Google Login Failed")}
              />
          </div>
          <div className="mt-3 d-flex justify-content-center">
            <button
              type="button"
              className="btn btn-link px-0 text-decoration-none fs-5"
              onClick={() => navigate("/login")}
              >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
