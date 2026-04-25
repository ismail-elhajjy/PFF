import { useState, useEffect } from "react";
import axios from "axios";
import { zonesByCity } from "../Data/ZonesData";
import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import Select from "react-select";
import "./Billboards.css";

function Billboards() {
  const [billboards, setBillboards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);
  const [selectedCity, setSelectedCity] = useState("allCities");
  const [selectedZone, setSelectedZone] = useState("allZones");
  const [selectedType, setSelectedType] = useState("allTypes");
  const [selectedSize, setSelectedSize] = useState("allSizes");
  const [maxPrice, setMaxPrice] = useState(5000);
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
      return <span className="status-badge unavailable">Unavailable</span>;
    }
    if (parseFloat(item.price) >= 25.0) {
      return <span className="status-badge high-demand">High Demand</span>;
    }
    return <span className="status-badge available">Available</span>;
  };

  const cityOptions = [
    { value: "allCities", label: "All Cities" },
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
    { value: "allTypes", label: "All Categories" },
    { value: "classic", label: "Classic Billboard" },
    { value: "digital", label: "Digital Screen" },
    { value: "led", label: "LED Wall" },
  ];

  const sizeOptions = [
    { value: "allSizes", label: "All Sizes" },
    { value: "small", label: "Small" },
    { value: "medium", label: "Medium" },
    { value: "large", label: "Large" },
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
      <h1>Billboard Spaces</h1>
      <p>Find the perfect advertising location across Morocco.</p>

        {/******************/}
        {/* Filter Section */}
        {/******************/}
      <div className="filter-wrapper">
        {/*****************/}
        {/* City Location */}
        {/*****************/}
        <div className="filter-group">
          <label>CITY LOCATION</label>
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

        {/*****************/}
        {/* Zone Location */}
        {/*****************/}
        <div className="filter-group">
          <label>ZONE</label>
          <Select
            options={[
              { value: "allZones", label: "All Zones" },
              ...availableZones,
            ]}
            styles={customStyles}
            value={[
              { value: "allZones", label: "All Zones" },
              ...availableZones,
            ].find((z) => z.value === selectedZone)}
            onChange={(opt) => setSelectedZone(opt.value)}
            isDisabled={selectedCity === "allCities"}
            isSearchable={false}
          />
        </div>

        {/*****************/}
        {/*  Panel Type   */}
        {/*****************/}
        <div className="filter-group">
          <label>PANEL TYPE</label>
          <Select
            options={typeOptions}
            styles={customStyles}
            defaultValue={typeOptions[0]}
            onChange={(opt) => setSelectedType(opt.value)}
            isSearchable={false}
          />
        </div>

        {/*****************/}
        {/*  Panel Size   */}
        {/*****************/}
        <div className="filter-group">
          <label>SIZE</label>
          <Select
            options={sizeOptions}
            styles={customStyles}
            defaultValue={sizeOptions[0]}
            onChange={(opt) => setSelectedSize(opt.value)}
            isSearchable={false}
          />
        </div>

        {/*****************/}
        {/*  Price Range  */}
        {/*****************/}
        <div className="filter-group price-filter">
          <div className="price-header">
            <label>PRICE RANGE</label>
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

        {/******************/}
        {/*  Panel Cards   */}
        {/******************/}
      <div className="billboards-grid">
        {loading ? (
          <div className="spinner-container">
            <div className="loading-spinner"></div>
            <p>Fetching billboards...</p>
          </div>
        ) : filteredBillboards.length > 0 ? (
          <>
            {filteredBillboards.slice(0, visibleCount).map((item) => (
              <div key={item.id} className="billboard-card">
                {/*****************/}
                {/*  Card Image   */}
                {/*****************/}
                <div className="card-image-wrapper">
                  <img
                    src={`http://127.0.0.1:8000/images/billboards/${item.image}`}
                    alt={item.title}
                  />
                  <div className="card-status-position">
                    {renderStatusBadge(item)}
                  </div>
                </div>

                {/*****************/}
                {/*  Card Content */}
                {/*****************/}
                <div className="card-content">
                  <h3 className="card-title">{`${item.title} ${item.type} Screen - ${item.zone}`}</h3>
                  <div className="card-location">
                    <span>
                      <MapPin size={15} className="map-location" /> {item.city}
                    </span>
                  </div>

                {/*****************/}
                {/*  Card badges  */}
                {/*****************/}
                  <div className="specs-container">
                    <span className="spec-tag">{item.type}</span>
                    <span className="spec-tag">{item.size}</span>
                  </div>

                {/*****************/}
                {/*  Card Footer  */}
                {/*****************/}
                  <div className="card-footer">
                    <div className="price-tag">
                      <span className="amount">{item.price} MAD</span>
                      <span className="period">/month</span>
                    </div>

                    {/*****************/}
                    {/*    Buttons    */}
                    {/*****************/}
                    {item.is_available ? (
                      <Link className="book-btn" to="/reservation">
                        Book Now
                      </Link>
                    ) : (
                      <button className="book-btn disabled" disabled>
                        Booked
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

                {/*****************/}
                {/* Load More Btn */}
                {/*****************/}
            {visibleCount < filteredBillboards.length && (
              <div className="load-more-container">
                <button
                  className="view-all-btn"
                  onClick={() => setVisibleCount((prev) => prev + 6)}
                >
                  View All Listings
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="no-data">No billboards match your search criteria.</p>
        )}
      </div>
      
    </div>
  );
}

export default Billboards;
