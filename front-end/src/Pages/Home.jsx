import "./Home.css";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import CitiesData from "../Data/CitiesData";
import Testimonials from "../Data/Testimonials";
import mainImg from "../assets/main-img44.png";
import {
  BarChart3,
  Globe,
  ShieldCheck,
  MapPin,
  ArrowRight,
  MapPinCheckInside,
  MousePointer,
  Send,
} from "lucide-react";

function Home() {
  const { t } = useTranslation();

  // for smooth scroll into cities section
  const citiesSectionRef = useRef(null);
  const scrollToCities = () => {
    citiesSectionRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div className="home-page">
      {/* ============================= */}
      {/*         Header Section        */}
      {/* ============================= */}
      
      <section className="hero-section">
        <div className="hero-container">
          {/* ============================= */}
          {/*  Left Section : Text,Buttons  */}
          {/* ============================= */}
          <div className="hero-text-content">
            <h1>
              {t("home.hero.title_part1")}
              <br />
              <span className="orange-text">AtlasAds</span>
            </h1>
            <p>{t("home.hero.description")}</p>
            <div className="hero-btns">
              <Link to="/billboards" className="btn-primary">
                {t("home.hero.btn_reserve")}
              </Link>
              <button className="btn-secondary" onClick={scrollToCities}>
                {t("home.hero.btn_explore")}
              </button>
            </div>
          </div>

          {/* ============================= */}
          {/*     Right Section : Image     */}
          {/* ============================= */}
          <div className="hero-image-wrapper">
            <div className="image-glow"></div>
            <img
              src={mainImg}
              alt="AtlasAds Platform Preview"
              className="hero-img"
            />

            {/* ========================= */}
            {/*       Location Card        */}
            {/* ========================= */}
            <div className="floating-location">
              <div className="pin-icon">
                <MapPin size={28} strokeWidth={2} />
              </div>
              <div className="info-text">
                <strong>{t("home.hero.floating_location")}</strong>
                <span>{t("home.hero.floating_zone")}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================= */}
      {/*      How It Works Section     */}
      {/* ============================= */}
      <section className="how-it-works">
        <h2>
          {t("home.how_it_works.title_part1")}{" "}
          <span> {t("home.how_it_works.title_part2")}</span>
        </h2>
        <p>{t("home.how_it_works.description")}</p>
        <div className="container-cards">
          <div className="card">
            <div className="card-top">
              <div className="icon-box">
                <MapPinCheckInside />
              </div>
              <span className="step-number">01</span>
            </div>
            <h5>{t("home.how_it_works.step1_title")}</h5>
            <p>{t("home.how_it_works.step1_desc")}</p>
          </div>

          <div className="card">
            <div className="card-top">
              <div className="icon-box">
                <MousePointer />
              </div>
              <span className="step-number">02</span>
            </div>

            <h5>{t("home.how_it_works.step2_title")}</h5>
            <p>{t("home.how_it_works.step2_desc")}</p>
          </div>

          <div className="card">
            <div className="card-top">
              <div className="icon-box">
                <Send />
              </div>
              <span className="step-number">03</span>
            </div>
            <h5>{t("home.how_it_works.step3_title")}</h5>
            <p>{t("home.how_it_works.step3_desc")}</p>
          </div>
        </div>
      </section>

      {/* ============================= */}
      {/*         Cities Section         */}
      {/* ============================= */}
      <section className="cities-section" ref={citiesSectionRef}>
        <div className="cities-header">
          <div className="cities-title">
            <h2>{t("home.cities.title")}</h2>
            <p>{t("home.cities.description")}</p>
          </div>

          <Link to="/billboards" className="view-all">
            {t("home.cities.view_all")}{" "}
            <span>{t("home.cities.cities_span")}</span>
            <ArrowRight size={20} strokeWidth={3} />
          </Link>
        </div>

        <div className="cities-container">
          {CitiesData.map((element, index) => (
            <Link to="/billboards" key={index} className="cities-cards">
              <img src={element.photo} alt={element.cityName} />
              <div className="cities-info">
                <h5>{element.cityName}</h5>
                <p>{element.status}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ============================= */}
      {/*        Features Section        */}
      {/* ============================= */}
      <section className="features-section">
        <div className="section-title">
          <h2>
            {t("home.features.title_part1")}{" "}
            <span className="orange-text">AtlasAds?</span>
          </h2>
          <p className="section-subtitle">{t("home.features.subtitle")}</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="icon-wrapper">
              <BarChart3 size={32} strokeWidth={2} />
            </div>
            <h3>{t("home.features.feat1_title")}</h3>
            <p>{t("home.features.feat1_desc")}</p>
          </div>

          <div className="feature-card">
            <div className="icon-wrapper">
              <Globe size={32} strokeWidth={2} />
            </div>
            <h3>{t("home.features.feat2_title")}</h3>
            <p>{t("home.features.feat2_desc")}</p>
          </div>

          <div className="feature-card">
            <div className="icon-wrapper">
              <ShieldCheck size={32} strokeWidth={2} />
            </div>
            <h3>{t("home.features.feat3_title")}</h3>
            <p>{t("home.features.feat3_desc")}</p>
          </div>
        </div>
      </section>

      {/* ============================= */}
      {/*      Testimonials Section      */}
      {/* ============================= */}

      <section className="testimonials-section">
        <div className="testimonials-container">
          {/* =========================== */}
          {/*     Testimonials Header     */}
          {/* =========================== */}
          <div className="testimonials-header">
            <span className="badge">{t("home.testimonials.badge")}</span>
            <h2>
              {t("home.testimonials.title_part1")}{" "}
              <span>{t("home.testimonials.title_part2")}</span>{" "}
              {t("home.testimonials.title_part3")}
            </h2>
            <p>{t("home.testimonials.subtitle")}</p>
          </div>
          <div className="testimonials-grid">
            {Testimonials.map((t) => (
              <div key={t.id} className="testimonial-card">
                <div className="stars">★★★★★</div>
                <div className="quote-icon">"</div>
                <p className="testimonial-text">{t.quote}</p>
                <div className="user-profile">
                  <div className={`avatar ${t.colorClass}`}>{t.initials}</div>
                  <div className="user-details">
                    <h4>{t.name}</h4>
                    <p className="role">{t.role}</p>
                    <p className="city">{t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* =========================== */}
          {/*         Stats Section        */}
          {/* =========================== */}
          <div className="stats-container">
            <div className="stat-card">
              <h3>500+</h3>
              <p>{t("home.stats.billboards")}</p>
            </div>
            <div className="stat-card">
              <h3>8</h3>
              <p>{t("home.stats.cities")}</p>
            </div>
            <div className="stat-card">
              <h3>98%</h3>
              <p>{t("home.stats.satisfied")}</p>
            </div>
            <div className="stat-card">
              <h3>200+</h3>
              <p>{t("home.stats.campaigns")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================= */}
      {/*          CTA Section           */}
      {/* ============================= */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <h2>
              {t("home.cta.title_part1")}{" "}
              <span>{t("home.cta.title_part2")}</span>
            </h2>
            <p>{t("home.cta.description")}</p>

            <div className="cta-buttons">
              <Link to="/billboards" className="start-btn">
                {t("home.cta.btn_start")}
              </Link>

              <Link to="/contact" className="contact-btn">
                {t("home.cta.btn_contact")}
              </Link>
            </div>
          </div>

          <div className="cta-decoration">
            <div className="glow-circle"></div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
