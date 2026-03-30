import { useState } from "react";  
import { Link, NavLink } from "react-router-dom";
import Logo from "../assets/PFF-logo-withoutBg2.png";
import "./Navbar.css";

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);  
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="navbar">
      <div className="nav-container">
        
        {/****************/}
        {/* Left Section */}
        {/****************/}
        <Link to="/" className="left-container">
          <div className="logo-wrapper">
            <img src={Logo} alt="AtlasAds" />
          </div>
          <h1>Atlas<span className="orange-text">Ads</span></h1>
        </Link>

        {/***************/}
        {/* Toggle Menu */}
        {/***************/}
        <div className={`menu-toggle ${isOpen ? 'open' : ''}`} onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        
        {/*****************/}
        {/* Right Section */}
        {/*****************/}
        <div className={`right-container ${isOpen ? 'show' : ''}`}>
          <NavLink to="/" onClick={() => setIsOpen(false)} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Home
          </NavLink>
          <NavLink to="/billboards" onClick={() => setIsOpen(false)} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Billboards 
          </NavLink>
          <NavLink to="/contact" onClick={() => setIsOpen(false)} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Contact
          </NavLink>
          <NavLink to="/login" onClick={() => setIsOpen(false)} className="nav-link login-btn">
            Login
          </NavLink>
        </div>

      </div>
    </nav>
  );
}

export default NavBar;