import "./Home.css";
import { Link } from "react-router-dom";
import { useRef } from "react";
import CitiesData from "../Data/CitiesData";
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
              Your Growth Starts with
              <br />
              <span className="orange-text">AtlasAds</span>
            </h1>
            <p>
              The ultimate platform to manage, track, and showcase your
              billboard campaigns with precision and style. Elevate your brand
              today.
            </p>
            <div className="hero-btns">
              <Link to="/billboards" className="btn-primary">
                Reserve a Panel
              </Link>
              <button className="btn-secondary" onClick={scrollToCities}>
                Explore Billboards
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
            {/*      Location Card        */}
            {/* ========================= */}
            <div className="floating-location">
              <div className="pin-icon">
                <MapPin size={28} strokeWidth={2} />
              </div>
              <div className="info-text">
                <strong>Boulevard Mohammed V</strong>
                <span>Zone Premium</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================= */}
      {/*      How It Works Section     */}
      {/* ============================= */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <p>
          Reserve your billboard space in just three simple steps. No
          complicated processes, no hidden fees.
        </p>
        <div className="container-cards">
          <div className="card">
            <div className="card-top">
              <div className="icon-box">
                <MapPinCheckInside />
              </div>
              <span className="step-number">01</span>
            </div>
            <h5>Choose a City</h5>
            <p>
              Select from major cities across Morocco where you want your brand
              to be seen.
            </p>
          </div>

          <div className="card">
            <div className="card-top">
              <div className="icon-box">
                <MousePointer />
              </div>
              <span className="step-number">02</span>
            </div>

            <h5>Select Zone & Billboard</h5>
            <p>
              Browse strategic zones and pick the perfect billboard for your
              campaign.
            </p>
          </div>

          <div className="card">
            <div className="card-top">
              <div className="icon-box">
                <Send />
              </div>
              <span className="step-number">03</span>
            </div>
            <h5>Send Reservation Request</h5>
            <p>
              Submit your request and our team will contact you to finalize the
              booking.
            </p>
          </div>
        </div>
      </section>
      
      {/* ============================= */}
      {/*        Cities Section         */}
      {/* ============================= */}
      <section className="cities-section" ref={citiesSectionRef}>
        <div className="cities-header">
          <div>
            <h2>Featured Cities</h2>
            <p>Explore premium locations in Morocco's economic hubs.</p>
          </div>

          <Link to="/billboards" className="view-all">
            View all <span>Cities</span>
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
      {/*       Features Section        */}
      {/* ============================= */}
      <section className="features-section">
        <div className="section-title">
          <h2>
            Why Choose <span className="orange-text">AtlasAds?</span>
          </h2>
          <p className="section-subtitle">
            The complete platform for outdoor advertising in Morocco.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="icon-wrapper">
              <BarChart3 size={32} strokeWidth={2} />
            </div>
            <h3>Real-time Stats</h3>
            <p>
              Track your billboard performance with live data and smart charts.
            </p>
          </div>

          <div className="feature-card">
            <div className="icon-wrapper">
              <Globe size={32} strokeWidth={2} />
            </div>
            <h3>Wide Coverage</h3>
            <p>Access the best locations across the country for your brand.</p>
          </div>

          <div className="feature-card">
            <div className="icon-wrapper">
              <ShieldCheck size={32} strokeWidth={2} />
            </div>
            <h3>Secure Management</h3>
            <p>Your campaigns are protected with our high-security system.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
