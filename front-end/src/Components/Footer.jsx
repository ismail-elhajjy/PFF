import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css'; 
import logo from '../assets/PFF-logo-withoutBg2.png'; 

function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        
        {/*****************************/}
        {/*  Section 1: Logo & Info   */}
        {/*****************************/}
        <div className="footer-section">
          <Link to="/" className="footer-logo">
            <img src={logo} alt="AtlasAds Logo" />
          </Link>
          <p>The best advertising solutions in Morocco to grow your brand.</p>
        </div>

        {/*****************************/}
        {/*  Section 2: Quick Links   */}
        {/*****************************/}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/">Services</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        {/*******************************/}
        {/*  Section 3: Contact Details */}
        {/*******************************/}
        <div className="footer-section">
          <h3>Contact</h3>
          <p>📍 Dar Bouazza, Casablanca</p>
          <p>📞 +212 7 09 08 32 72</p>
          <p>✉️ support@atlasads.ma</p>
        </div>

      </div>

      <div className="footer-bottom">
        <p>&copy; 2026 AtlasAds. Created by Ismail.</p>
      </div>
    </footer>
  );
}

export default Footer;