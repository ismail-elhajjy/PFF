import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Logo from "../assets/PFF-logo-withoutBg2.png";
import "./Navbar.css";
import axios from "axios";
import { Globe, User, LogOut } from "lucide-react";

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const toggleMenu = () => setIsOpen(!isOpen);

  const changeLanguage = (e) => {
    const selectedLanguage = e.target.value;
    i18n.changeLanguage(selectedLanguage);
    document.body.dir = selectedLanguage === "ar" ? "rtl" : "ltr";
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await axios.post(
          "http://127.0.0.1:8000/api/logout",
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.clear();
      setIsOpen(false);
      setProfileDropdown(false);
      navigate("/login");
      window.location.reload();
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* -----------------------*/}
        {/*   Left Section: Logo   */}
        {/* -----------------------*/}
        <div className="nav-section-left">
          <Link to="/" className="left-container">
            <div className="logo-wrapper">
              <img src={Logo} alt="AtlasAds" />
            </div>
            <h1>
              Atlas<span className="orange-text">Ads</span>
            </h1>
          </Link>
        </div>

        {/* ----------------------- */}
        {/*   Menu Toggle (Mobile)  */}
        {/* ----------------------- */}
        <div
          className={`menu-toggle ${isOpen ? "open" : ""}`}
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        
        <div className={`nav-main-menu ${isOpen ? "show" : ""}`}>
          {/* ------------------------ */}
          {/*   Left Section: Links    */}
          {/* ------------------------ */}
          <div className="nav-section-center">
            <NavLink
              to="/"
              className="nav-link"
              onClick={() => setIsOpen(false)}
            >
              {t("nav.home")}
            </NavLink>
            <NavLink
              to="/billboards"
              className="nav-link"
              onClick={() => setIsOpen(false)}
            >
              {t("nav.billboards")}
            </NavLink>
            <NavLink
              to="/contact"
              className="nav-link"
              onClick={() => setIsOpen(false)}
            >
              {t("nav.contact")}
            </NavLink>
          </div>

          {/* ------------------------ */}
          {/*  Right Section: Profile  */}
          {/* ------------------------ */}
          <div className="nav-section-right">
            <div className="lang-selector">
              <Globe size={18} />
              <select
                className="lang-select"
                value={i18n.language}
                onChange={changeLanguage}
              >
                <option value="en">EN</option>
                <option value="fr">FR</option>
                <option value="ar">AR</option>
              </select>
            </div>

            {isLoggedIn ? (
              <div className="profile-dropdown-wrapper" ref={dropdownRef}>
                <button
                  className="profile-trigger-btn"
                  onClick={() => setProfileDropdown(!profileDropdown)}
                >
                  <User size={22} />
                  <span className="mobile-only-text">
                    {t("nav.profile") || "Account"}
                  </span>
                </button>
                <div
                  className={`profile-dropdown-menu ${profileDropdown ? "show" : ""}`}
                >
                  <NavLink
                    to="/profile"
                    className="nav-link dropdown-item special-icon"
                    onClick={() => setIsOpen(false)}
                   
                  >
                    <User size={18}  className="profile-icon"/> {t("nav.profile")}
                  </NavLink>

                  <button
                    className="nav-link dropdown-item logout-item"
                    onClick={handleLogout}
                    
                  >
                    <LogOut size={18} /> {t("nav.logout")}
                  </button>

                </div>
              </div>
            ) : (
              <NavLink
                to="/login"
                className="login-btn"
                onClick={() => setIsOpen(false)}
              >
                {t("nav.login") || "Login"}
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
