import MainLogo from "../assets/PFF-logo-withoutBg2.png";
import axios from "axios";
import "./Login.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      navigate("/contact");
    } catch (err) {
      if (!err.response) {
        setError(" Problem connecting to the server. Please try again later.");

      } else if (err.response.status === 401) {
        setError(" Incorrect email or password. Please check and try again.");

      } else if (err.response.status === 422) {
        setError(" Please provide a valid email and password.");
        
      } else {
        setError(" Something went wrong. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-container">
      {/**************************/}
      {/* Left Side Of The Page  */}
      {/**************************/}
      <div className="login-left-side">
        <div className="container-logo">
          <img src={MainLogo} alt="AtlasAds Logo" className="main-logo" />
        </div>

        <div className="welcome-content">
          <h1>
            Welcome back to <span>AtlasAds</span>
          </h1>
          <p>
            Sign in to manage your billboard reservations and campaigns across
            Morocco.
          </p>
        </div>

        <div className="footer-text">© 2026 AtlasAds. All rights reserved.</div>
      </div>

      {/**************************/}
      {/* Right Side Of The Page */}
      {/**************************/}
      <div className="login-right-side">
        <div className="login-card">
          <h2>Sign In</h2>
          <p className="subtitle">
            Enter your credentials to access your account
          </p>

          {error && (
            <div className="error-msg">
              <span>⚠️ {error}</span>
            </div>
          )}

          {/***************/}
          {/* Login Form  */}
          {/***************/}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                className="input"
                placeholder="email@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/*****************/}
          {/* Register Link */}
          {/*****************/}
          <div className="register-container">
            Don't have an account?
            <Link to="/register" className="register-link">
              Register here
            </Link>
          </div>

          {/******************/}
          {/* Back Home Link */}
          {/******************/}
          <Link to="/home" className="back-home">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
