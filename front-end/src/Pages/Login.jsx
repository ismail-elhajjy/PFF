import MainLogo from "../assets/PFF-logo-withoutBg2.png";
import axios from "axios";
import "./Login.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

const Login = () => {
  const { t } = useTranslation();

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

      const { token, user } = response.data;

      // 1. Storage: تسجيل التوكن والمعلومات الأساسية
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", user.role); // مهمة بزاف للـ ProtectedRoute

      // 2. Conditional Routing: توجيه المستخدم حسب الـ Role
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }

      // 3. Sync: تحديث حالة الـ App
      window.location.reload();
    } catch (err) {
      // Handling errors based on status codes we defined in Laravel
      if (!err.response) {
        setError(t("login.errors.server"));
      } else if (err.response.status === 403) {
        // هادي هي الحالة فاش كيكون User ماشي Admin وباغي يدخل
        setError(err.response.data.message || "Access denied: Admins only.");
      } else if (err.response.status === 401) {
        setError(t("login.errors.invalidCredentials"));
      } else {
        setError(t("login.errors.general"));
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
            {t("login.left.title")} <span>AtlasAds</span>
          </h1>

          <p>{t("login.left.subtitle")}</p>
        </div>

        <div className="footer-text">{t("login.left.footer")}</div>
      </div>

      {/**************************/}
      {/* Right Side Of The Page */}
      {/**************************/}
      <div className="login-right-side">
        <div className="login-card">
          <h2>{t("login.right.title")}</h2>

          <p className="subtitle">{t("login.right.subtitle")}</p>

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
              <label>{t("login.form.email")}</label>

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
              <label>{t("login.form.password")}</label>

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
              {loading ? t("login.form.loadingBtn") : t("login.form.loginBtn")}
            </button>
          </form>

          {/*****************/}
          {/* Register Link */}
          {/*****************/}
          <div className="register-container">
            {t("login.register.text")}

            <Link to="/register" className="register-link">
              {t("login.register.link")}
            </Link>
          </div>

          {/******************/}
          {/* Back Home Link */}
          {/******************/}
          <Link to="/" className="back-home">
            <ArrowLeft size={20} strokeWidth={3} />
            <span>{t("login.backHome")}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
