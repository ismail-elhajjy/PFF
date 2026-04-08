import MainLogo from "../assets/PFF-logo-withoutBg2.png";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Register.css";
import { ArrowLeft } from "lucide-react";


function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  function submit(e) {
    e.preventDefault();
    setErrors({});
    setSuccessMsg("");
    setLoading(true);

    axios
      .post("http://127.0.0.1:8000/api/register", formData)
      .then((res) => {
        console.log(res.data);
        setSuccessMsg("Account created! Redirecting to login...");
        setTimeout(() => {
          setLoading(false);
          navigate("/login");
        }, 2000);
      })
      .catch((err) => {
        setLoading(false);
        if (err.response && err.response.status === 422) {
          setErrors(err.response.data.errors);
        }
      });
  }

  return (
    <div className="main-container">
      {/******************/}
      {/*   Left Panel   */}
      {/******************/}
      <div className="left-panel">
        <div className="box-logo">
          <img src={MainLogo} alt="AtlasAds Logo" className="main-logo" />
        </div>
        <h1>
          Join <span className="title">AtlasAds</span>
        </h1>
        <p className="desc">
          Create an account to manage your billboard reservations and campaigns
          across Morocco.
        </p>
        <div className="footer">© 2026 AtlasAds. All rights reserved.</div>
      </div>

      {/*******************/}
      {/*   Right Panel   */}
      {/*******************/}
      <div className="right-panel">
        <div className="form-container">
          <h2>Sign Up</h2>
          <p className="subtitle">Enter your details to create your account</p>
          {successMsg && <div className="success-banner">{successMsg}</div>}

          <form onSubmit={submit}>
            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              {errors.name && (
                <span className="error-msg">{errors.name[0]}</span>
              )}
            </div>

            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="email@gmail.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && (
                <span className="error-msg">{errors.email[0]}</span>
              )}
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {errors.password && (
                <span className="error-msg">{errors.password[0]}</span>
              )}
            </div>

            <div className="input-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="password_confirmation"
                placeholder="••••••••"
                value={formData.password_confirmation}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>

          <div className="links">
            <p>
              Already have an account?{" "}
              <span onClick={() => navigate("/login")} className="link-text">
                Login here
              </span>
            </p>
            <Link to="/" className="back-home">
              <ArrowLeft size={20} strokeWidth={3}/><span> Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;