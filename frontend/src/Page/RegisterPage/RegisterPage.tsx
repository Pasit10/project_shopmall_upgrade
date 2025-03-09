import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import validator from "validator";
import axiosInstant from "../utils/axios";
import { Lock, Mail, LogIn, UserPlus } from "lucide-react";
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
    <div className="min-vh-100 d-flex align-items-center justify-content-center">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div
              className="card shadow-lg border-0"
              style={{
                borderRadius: "1rem",
                backdropFilter: "blur(10px)",
                background: "rgba(255, 255, 255, 0.95)",
              }}
            >
              <div className="card-header text-center border-0 bg-transparent pt-4">
                <div className="d-inline-flex align-items-center justify-content-center bg-primary rounded-circle p-3 mb-3">
                  <UserPlus size={30} className="text-white" />
                </div>
                <h3 className="fw-bold mb-0">Create Your Account</h3>
                <p className="text-muted">Join our community today</p>
              </div>

              <div className="card-body p-4 p-md-5">
                {error && (
                  <div
                    className="alert alert-danger d-flex align-items-center"
                    role="alert"
                  >
                    <Lock size={18} className="me-2" />
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="form-group mb-4">
                    <div className="input-group input-group-lg">
                      <span className="input-group-text bg-light border-end-0">
                        <Mail size={18} className="text-primary" />
                      </span>
                      <input
                        type="email"
                        className="form-control border-start-0 ps-0"
                        placeholder="Your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ borderLeftColor: "transparent" }}
                      />
                    </div>
                  </div>

                  <div className="form-group mb-4">
                    <div className="input-group input-group-lg">
                      <span className="input-group-text bg-light border-end-0">
                        <Lock size={18} className="text-primary" />
                      </span>
                      <input
                        type="password"
                        className="form-control border-start-0 ps-0"
                        placeholder="Create password"
                        value={password}
                        onChange={(e) => validatePassword(e.target.value)}
                        required
                        style={{ borderLeftColor: "transparent" }}
                      />
                    </div>
                    {passwordError && (
                      <div className="alert alert-warning mt-2 py-2 d-flex align-items-center">
                        <Lock size={16} className="me-2" />
                        <small>{passwordError}</small>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100 mb-4 d-flex align-items-center justify-content-center"
                    style={{
                      borderRadius: "0.5rem",
                      fontSize: "1rem",
                      padding: "0.75rem",
                    }}
                  >
                    <UserPlus size={20} className="me-2" />
                    Create Account
                  </button>

                  <div className="position-relative my-4">
                    <hr className="text-muted" />
                    <div className="position-absolute top-50 start-50 translate-middle px-3 bg-white">
                      <span className="text-muted">or continue with</span>
                    </div>
                  </div>

                  <div className="d-flex justify-content-center mb-4">
                    <GoogleLogin
                      onSuccess={handleGoogleRegistersSuccess}
                      onError={() => setError("Google Login Failed")}
                      theme="filled_blue"
                      size="large"
                      shape="pill"
                    />
                  </div>

                  <div className="text-center">
                    <p className="text-muted mb-2">Already have an account?</p>
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-lg w-100 d-flex align-items-center justify-content-center"
                      onClick={() => navigate("/login")}
                      style={{
                        borderRadius: "0.5rem",
                        fontSize: "1rem",
                        padding: "0.75rem",
                      }}
                    >
                      <LogIn size={20} className="me-2" />
                      Sign In
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default RegisterPage;
