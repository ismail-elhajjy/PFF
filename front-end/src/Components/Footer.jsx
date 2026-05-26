import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; 
import './Footer.css'; 
import logo from '../assets/PFF-logo-withoutBg2.png'; 
import {MapPin,Phone,Mail} from 'lucide-react';

function Footer() {
  const { t } = useTranslation();  

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
          <p>{t('footer.description')}</p>
        </div>

        {/*****************************/}
        {/*  Section 2: Quick Links   */}
        {/*****************************/}
        <div className="footer-section">
          <h3>{t('footer.links_title')}</h3>
          <ul>
            <li><Link to="/">{t('footer.links.home')}</Link></li>
            <li><Link to="/contact">{t('footer.links.contact')}</Link></li>
            <li><Link to="/login">{t('footer.links.login')}</Link></li>
          </ul>
        </div>

        {/*******************************/}
        {/*  Section 3: Contact Details */}
        {/*******************************/}
        <div className="footer-section">
          <h3>{t('footer.contact_title')}</h3>
          <p><MapPin color='#ff6600' size={18} className='icons'/> {t('footer.address')}</p>
          <p><Phone  color='#ff6600' size={18} className='icons'/> +212 7 09 08 32 72</p>
          <p><Mail   color='#ff6600' size={18} className='icons'/> support@atlasads.ma</p>
        </div>

      </div>

      <div className="footer-bottom">
        <p>{t('footer.copyright')}</p>
      </div>
    </footer>
  );
}

export default Footer;