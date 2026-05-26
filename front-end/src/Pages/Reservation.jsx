import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Check,
  Upload,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Building2,
  Phone,
  MapPin,
  FileText,
} from "lucide-react";
import "./Reservation.css";
import { getBillboardImageUrl } from "../utils/billboardMedia";

const Reservation = () => {
  const { t } = useTranslation();

  const { id } = useParams();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(2);
  const [billboard, setBillboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [resId, setResId] = useState(null);

  const [formData, setFormData] = useState({
    start_date: "",
    end_date: "",
    phone: "",
    company_name: "",
  });

  const Toast = Swal.mixin({
    toast: true,
    position: "bottom-end",
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
  });

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/billboards/${id}`)
      .then((res) => {
        setBillboard(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching billboard:", err);
        setLoading(false);
      });
  }, [id]);

  const getAcceptType = () => {
    if (!billboard) return "image/*,video/*";

    switch (billboard.type) {
      case "Classic":
        return "image/*";

      case "LED":
        return "video/*";

      case "Digital":
        return "image/*,video/*";

      default:
        return "image/*,video/*";
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const fileType = selectedFile.type;
    const bType = billboard.type;
    let isValid = false;

    if (bType === "Classic") {
      isValid = fileType.startsWith("image/");
    } else if (bType === "LED") {
      isValid = fileType.startsWith("video/");
    } else if (bType === "Digital") {
      isValid = fileType.startsWith("image/") || fileType.startsWith("video/");
    }

    if (!isValid) {
      Toast.fire({
        icon: "error",
        title: t("reservation.invalidFile", {
          type:
            bType === "Classic"
              ? t("reservation.imageOnly")
              : bType === "LED"
                ? t("reservation.videoOnly")
                : t("reservation.imageVideo"),
        }),
      });

      e.target.value = null;
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const calculateDuration = () => {
    if (!formData.start_date || !formData.end_date) return 0;

    const start = new Date(formData.start_date);
    const end = new Date(formData.end_date);

    const diffTime = Math.abs(end - start);

    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const calculateTotal = () => {
    const diffDays = calculateDuration();

    if (diffDays === 0 || !billboard) return 0;

    const cleanPrice = billboard.price.toString().replace(".", "");
    const rawTotal = diffDays * (parseFloat(cleanPrice) / 30);

    return Math.ceil(rawTotal / 100) * 100;
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const nextStep = () => {
    if (
      step === 2 &&
      (!formData.start_date || !formData.end_date || !formData.phone)
    ) {
      Toast.fire({
        icon: "warning",
        title: t("reservation.requiredFields"),
      });
      return;
    }

    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!file) {
      Toast.fire({
        icon: "warning",
        title: t("reservation.uploadRequired"),
      });
      return;
    }

    setSubmitting(true);

    const data = new FormData();

    data.append("billboard_id", id);
    data.append("creative_file", file);
    data.append("start_date", formData.start_date);
    data.append("end_date", formData.end_date);
    data.append("phone", formData.phone);
    data.append("company_name", formData.company_name || "");

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/reservations",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      if (
        response.data &&
        (response.data.id || response.data.reservation?.id)
      ) {
        setResId(response.data.id || response.data.reservation.id);
      }

      setStep(4);

      Toast.fire({
        icon: "success",
        title: "Reservation confirmed! We will contact you soon.",
      });
    } catch (error) {
      const msg =
        error.response?.data?.message || t("reservation.submissionFailed");

      Toast.fire({
        icon: "error",
        title: msg,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loader-wrapper">
        <div className="custom-spinner"></div>
        <p>{t("reservation.loading")}</p>
      </div>
    );
  }

  if (!billboard) {
    return (
      <div className="error-view">
        <div className="error-view-content">
          <div className="error-icon-box">
            <MapPin size={40} />
          </div>

          <h2>{t("reservation.notFound")}</h2>

          <button className="back-home-btn" onClick={() => navigate("/")}>
            <ArrowLeft size={18} />
            {t("reservation.backCatalog")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="reservation-container">
      {/* Stepper */}
      <div className="stepper-wrapper">
        {[1, 2, 3, 4].map((s) => {
          const isCompleted = step > s || (step === 4 && s === 4);
          const isActive = step === s && step !== 4;

          return (
            <React.Fragment key={s}>
              <div
                className={`step-item ${
                  isActive ? "active" : ""
                } ${isCompleted ? "completed" : ""}`}
              >
                <div className="step-node">
                  {isCompleted ? (
                    <Check size={18} strokeWidth={3} />
                  ) : (
                    <span>{s}</span>
                  )}
                </div>

                <label>
                  {s === 1
                    ? t("reservation.steps.select")
                    : s === 2
                      ? t("reservation.steps.details")
                      : s === 3
                        ? t("reservation.steps.payment")
                        : t("reservation.steps.success")}
                </label>
              </div>

              {s < 4 && (
                <div
                  className={`step-connector ${step > s ? "filled" : ""}`}
                ></div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div className="reservation-grid">
        {/* Left */}
        <aside className="summary-card">
          <div className="billboard-preview">
            <img
              src={getBillboardImageUrl(billboard.image)}
              alt={billboard.title}
            />

            <div className="type-badge">{billboard.type}</div>

            <div className="size-badge">{billboard.size}</div>
          </div>

          <div className="summary-info">
            <h2>
              {billboard.title} {billboard.type} {t("reservation.screen")}
            </h2>

            <p className="location">
              <MapPin size={16} />
              {billboard.city}, {billboard.zone}
            </p>

            <div className="price-info">
              <span className="quantity">{billboard.price} MAD</span>
              <span>{t("reservation.perMonth")}</span>
            </div>
          </div>
        </aside>

        {/* Right */}
        <main className="form-card">
          {step === 2 && (
            <div className="step-content animate-step">
              <h3>{t("reservation.clientDetails")}</h3>

              <div className="input-container">
                <label>
                  <Building2 size={16} />
                  {t("reservation.companyName")}
                </label>

                <input
                  type="text"
                  name="company_name"
                  placeholder={t("reservation.optional")}
                  value={formData.company_name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="input-container">
                <label>
                  <Phone size={16} />
                  {t("reservation.phone")}
                </label>

                <input
                  type="text"
                  name="phone"
                  placeholder="+212 000 000 000"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>

              <div className="date-container">
                <div className="input-container">
                  <label>
                    <Calendar size={16} />
                    {t("reservation.startDate")}
                  </label>

                  <input
                    type="date"
                    name="start_date"
                    required
                    value={formData.start_date}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="input-container">
                  <label>
                    <Calendar size={16} />
                    {t("reservation.endDate")}
                  </label>

                  <input
                    type="date"
                    name="end_date"
                    required
                    value={formData.end_date}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <button className="continue-btn" onClick={nextStep}>
                {t("reservation.continuePayment")}
                <ArrowRight size={18} />
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="step-content animate-step">
              <h3>{t("reservation.finalize")}</h3>

              <p className="upload-title">
                {t("reservation.uploadText")} (
                {billboard.type === "Classic"
                  ? t("reservation.imageOnly")
                  : billboard.type === "LED"
                    ? t("reservation.videoOnly")
                    : t("reservation.imageVideo")}
                ).
              </p>

              <div className={`upload-zone ${file ? "has-file" : ""}`}>
                <input
                  type="file"
                  accept={getAcceptType()}
                  onChange={handleFileChange}
                  id="file-input"
                />

                <label htmlFor="file-input">
                  <Upload size={32} />
                  <span>
                    {file ? file.name : t("reservation.uploadCreative")}
                  </span>
                </label>
              </div>

              <div className="total-container">
                <div className="price-display">
                  <span>{t("reservation.total")}</span>
                  <span className="total-price">{calculateTotal()} MAD</span>
                </div>

                <div className="duration-display">
                  <Calendar size={14} />
                  <span>
                    {t("reservation.duration")}{" "}
                    <strong>
                      {calculateDuration()} {t("reservation.days")}
                    </strong>
                  </span>
                </div>
              </div>

              <div className="btn-container">
                <button className="back-btn" onClick={prevStep}>
                  <ArrowLeft size={18} />
                  {t("reservation.back")}
                </button>

                <button
                  className="confirm-btn"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="btn-spinner" ></span>
                      Processing...
                    </>
                  ) : (
                    t("reservation.confirm")
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="success-content animate-scale">
              <div className="success-icon">
                <Check size={50} strokeWidth={4} color="white" />
              </div>

              <h1>{t("reservation.confirmedTitle")}</h1>

              <p>{t("reservation.confirmedText")}</p>

              <div className="success-actions">
                <button className="back-home-btn" onClick={() => navigate("/")}>
                  {t("reservation.backHome")}
                </button>

                {resId && (
                  <button
                    className="download-pdf-btn"
                    onClick={() => {
                      Toast.fire({
                        icon: "success",
                        title: "Your receipt is downloading...",
                      });

                      setTimeout(() => {
                        window.open(
                          `http://127.0.0.1:8000/api/reservations/pdf/${resId}`,
                          "_blank",
                        );
                      }, 800);
                    }}
                  >
                    <FileText size={18} />
                    {t("reservation.downloadReceipt")}
                  </button>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Reservation;
