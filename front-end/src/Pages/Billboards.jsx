import { useState, useEffect } from "react";
import axios from "axios";
import { zonesByCity } from "../Data/ZonesData";
import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import Select from "react-select";
import "./Billboards.css";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { getBillboardImageUrl } from "../utils/billboardMedia";

function Billboards() {
  const { t } = useTranslation();
  const [billboards, setBillboards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);
  const [selectedCity, setSelectedCity] = useState("allCities");
  const [selectedZone, setSelectedZone] = useState("allZones");
  const [selectedType, setSelectedType] = useState("allTypes");
  const [selectedSize, setSelectedSize] = useState("allSizes");
  const [maxPrice, setMaxPrice] = useState(5000);
  const navigate = useNavigate();

  
  const Toast = Swal.mixin({
    toast: true,
    position: "bottom-end",
    showConfirmButton: false,
    timer: 4000,
    timerProgressBar: true,
  });

  
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/billboards")
      .then((res) => {
        setBillboards(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data from API:", err);
        setLoading(false);
      });
  }, []);

  
  const handleViewDetails = (id) => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");

      Toast.fire({
        icon: "warning",
        title: t("billboards.loginFirst"),
      });

      return;
    }

    navigate(`/reservation/${id}`);
  };

  const availableZones =
    selectedCity !== "allCities"
      ? (zonesByCity[selectedCity.toLowerCase()] || []).map((zone) => ({
          value: zone.toLowerCase(),
          label: zone,
        }))
      : [];

  
  const filteredBillboards = billboards
    .filter((item) => {
      const cityMatch =
        selectedCity === "allCities" ||
        item.city.toLowerCase() === selectedCity.toLowerCase();

      const zoneMatch =
        selectedZone === "allZones" ||
        item.zone.toLowerCase() === selectedZone.toLowerCase();

      const typeMatch =
        selectedType === "allTypes" ||
        item.type.toLowerCase() === selectedType.toLowerCase();

      const sizeMatch =
        selectedSize === "allSizes" ||
        (item.size && item.size.toLowerCase() === selectedSize.toLowerCase());

      return cityMatch && zoneMatch && typeMatch && sizeMatch;
    })
    .sort((a, b) => {
      const priceA = Number(a.price.toString().replace(/\./g, ""));
      const priceB = Number(b.price.toString().replace(/\./g, ""));
      const diffA = Math.abs(priceA - maxPrice);
      const diffB = Math.abs(priceB - maxPrice);

      return diffA - diffB;
    });

  
  const renderStatusBadge = (item) => {
    if (!item.is_available) {
      return (
        <span className="status-badge unavailable">
          {t("billboards.unavailable")}
        </span>
      );
    }

    if (parseFloat(item.price) >= 25.0) {
      return (
        <span className="status-badge high-demand">
          {t("billboards.highDemand")}
        </span>
      );
    }

    return (
      <span className="status-badge available">
        {t("billboards.available")}
      </span>
    );
  };

  const cityOptions = [
    { value: "allCities", label: t("billboards.allCities") },
    { value: "casablanca", label: "Casablanca" },
    { value: "rabat", label: "Rabat" },
    { value: "marrakech", label: "Marrakech" },
    { value: "tanger", label: "Tanger" },
    { value: "chefchaouen", label: "Chefchaouen" },
    { value: "agadir", label: "Agadir" },
    { value: "fes", label: "Fes" },
    { value: "essaouira", label: "Essaouira" },
  ];

  const typeOptions = [
    { value: "allTypes", label: t("billboards.allTypes") },
    { value: "classic", label: t("billboards.classic") },
    { value: "digital", label: t("billboards.digital") },
    { value: "led", label: t("billboards.led") },
  ];

  const sizeOptions = [
    { value: "allSizes", label: t("billboards.allSizes") },
    { value: "small", label: t("billboards.small") },
    { value: "medium", label: t("billboards.medium") },
    { value: "large", label: t("billboards.large") },
  ];

  
  const customStyles = {
    control: (base, state) => ({
      ...base,
      borderRadius: "12px",
      border: state.isFocused ? "1.5px solid #ff7300" : "1.5px solid #e2e8f0",
      boxShadow: "none",
      "&:hover": { border: "1.5px solid #ff7300" },
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#ff7300"
        : state.isFocused
          ? "#fff5eb"
          : "white",
      color: state.isSelected ? "white" : "#333",
      cursor: "pointer",
      "&:active": { backgroundColor: "#ff7300" },
    }),
    menu: (base) => ({
      ...base,
      borderRadius: "12px",
      overflow: "hidden",
    }),
  };

  return (
    <div className="parent-container">
      <h1>{t("billboards.title")}</h1>
      <p>{t("billboards.subtitle")}</p>

      {/* Filter Section */}
      <div className="filter-wrapper">
        <div className="filter-group">
          <label>{t("billboards.cityLocation")}</label>
          <Select
            options={cityOptions}
            styles={customStyles}
            defaultValue={cityOptions[0]}
            onChange={(opt) => {
              setSelectedCity(opt.value);
              setSelectedZone("allZones");
            }}
            isSearchable={false}
          />
        </div>

        <div className="filter-group">
          <label>{t("billboards.zone")}</label>
          <Select
            options={[
              { value: "allZones", label: t("billboards.allZones") },
              ...availableZones,
            ]}
            styles={customStyles}
            value={[
              { value: "allZones", label: t("billboards.allZones") },
              ...availableZones,
            ].find((z) => z.value === selectedZone)}
            onChange={(opt) => setSelectedZone(opt.value)}
            isDisabled={selectedCity === "allCities"}
            isSearchable={false}
          />
        </div>

        <div className="filter-group">
          <label>{t("billboards.panelType")}</label>
          <Select
            options={typeOptions}
            styles={customStyles}
            defaultValue={typeOptions[0]}
            onChange={(opt) => setSelectedType(opt.value)}
            isSearchable={false}
          />
        </div>

        <div className="filter-group">
          <label>{t("billboards.size")}</label>
          <Select
            options={sizeOptions}
            styles={customStyles}
            defaultValue={sizeOptions[0]}
            onChange={(opt) => setSelectedSize(opt.value)}
            isSearchable={false}
          />
        </div>

        <div className="filter-group price-filter">
          <div className="price-header">
            <label>{t("billboards.priceRange")}</label>
            <span className="current-price">
              {maxPrice.toLocaleString()} MAD
            </span>
          </div>

          <input
            type="range"
            min="5000"
            max="50000"
            step="1000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(parseInt(e.target.value))}
            className="price-slider"
          />
        </div>
      </div>

      <div className="billboards-grid">
        {loading ? (
          <div className="spinner-container">
            <div className="loading-spinner"></div>
            <p>{t("billboards.loading")}</p>
          </div>
        ) : filteredBillboards.length > 0 ? (
          <>
            {filteredBillboards.slice(0, visibleCount).map((item) => (
              <div key={item.id} className="billboard-card">
                <div className="card-image-wrapper">
                  <img
                    src={getBillboardImageUrl(item.image)}
                    alt={item.title}
                  />

                  <div className="card-status-position">
                    {renderStatusBadge(item)}
                  </div>
                </div>

                <div className="card-content">
                  <h3 className="card-title">
                    {`${item.title} ${item.type} Screen - ${item.zone}`}
                  </h3>

                  <div className="card-location">
                    <span>
                      <MapPin size={15} className="map-location" /> {item.city}
                    </span>
                  </div>

                  <div className="specs-container">
                    <span className="spec-tag">{item.type}</span>
                    <span className="spec-tag">{item.size}</span>
                  </div>

                  <div className="card-footer">
                    <div className="price-tag">
                      <span className="amount">{item.price} MAD</span>
                      <span className="period">{t("billboards.perMonth")}</span>
                    </div>

                    {item.is_available ? (
                      <button
                        className="view-btn"
                        onClick={() => handleViewDetails(item.id)}
                        style={{ cursor: "pointer", border: "none" }}
                      >
                        {t("billboards.viewDetails")}
                      </button>
                    ) : (
                      <button className="view-btn disabled" disabled>
                        {t("billboards.booked")}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {visibleCount < filteredBillboards.length && (
              <div className="load-more-container">
                <button
                  className="view-all-btn"
                  onClick={() => setVisibleCount((prev) => prev + 6)}
                >
                  {t("billboards.viewAll")}
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="no-data">{t("billboards.noResults")}</p>
        )}
      </div>
    </div>
  );
}

export default Billboards;
