import MainLogo from "../assets/PFF-logo-withoutBg2.png";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Register.css";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

function Register() {
  const { t } = useTranslation();

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

        setSuccessMsg(t("register.success"));

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
          {t("register.join")} <span className="title">AtlasAds</span>
        </h1>

        <p className="desc">{t("register.desc")}</p>

        <div className="footer">{t("register.footer")}</div>
      </div>

      {/*******************/}
      {/*   Right Panel   */}
      {/*******************/}
      <div className="right-panel">
        <div className="form-container">
          <h2>{t("register.signUp")}</h2>

          <p className="subtitle">{t("register.subtitle")}</p>

          {successMsg && <div className="success-banner">{successMsg}</div>}

          <form onSubmit={submit}>
            {/* Full Name */}
            <div className="input-group">
              <label>{t("register.fullName")}</label>

              <input
                type="text"
                name="name"
                placeholder={t("register.fullName")}
                value={formData.name}
                onChange={handleChange}
                required
              />

              {errors.name && (
                <span className="error-msg">{errors.name[0]}</span>
              )}
            </div>

            {/* Email */}
            <div className="input-group">
              <label>{t("register.email")}</label>

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

            {/* Password */}
            <div className="input-group">
              <label>{t("register.password")}</label>

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

            {/* Confirm Password */}
            <div className="input-group">
              <label>{t("register.confirmPassword")}</label>

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
              {loading ? t("register.signingUp") : t("register.signUp")}
            </button>
          </form>

          <div className="links">
            <p>
              {t("register.haveAccount")}{" "}
              <span onClick={() => navigate("/login")} className="link-text">
                {t("register.loginHere")}
              </span>
            </p>

            <Link to="/" className="back-home">
              <ArrowLeft size={20} strokeWidth={3} />
              <span>{t("register.backHome")}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;