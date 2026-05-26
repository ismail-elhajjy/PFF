import { useState } from "react";
import axios from "axios";
import "./Contact.css";
import { MapPin, Phone, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";

function Contact() {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState({ type: "", msg: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setStatus({
      type: "loading",
      msg: t("contact.status.sending"),
    });

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/contact",
        formData
      );

      if (response.status === 201) {
        setStatus({
          type: "success",
          msg: t("contact.status.success"),
        });

        setFormData({
          fullname: "",
          email: "",
          message: "",
        });

        setTimeout(() => {
          setStatus({ type: "", msg: "" });
        }, 5000);
      }
    } catch (error) {
      console.error("Error:", error);

      setStatus({
        type: "error",
        msg: t("contact.status.error"),
      });
    }
  };

  return (
    <div className="contact-wrapper">
      <div className="contact-container">
        
        {/* Contact Info */}
        <div className="contact-info">
          <h2>{t("contact.title")}</h2>

          <p>{t("contact.subtitle")}</p>

          <div className="info-details">
            <div className="info-item">
              <span>
                <MapPin size={25} strokeWidth={2} />
              </span>
              <div>
                <strong>{t("contact.info.headquarters")}</strong>
                <p>{t("contact.info.location")}</p>
              </div>
            </div>

            <div className="info-item">
              <span>
                <Phone size={25} strokeWidth={2} />
              </span>
              <div>
                <strong>{t("contact.info.phone")}</strong>
                <p>+212 7 09 08 32 72</p>
              </div>
            </div>

            <div className="info-item">
              <span>
                <Mail size={25} strokeWidth={2} />
              </span>
              <div>
                <strong>{t("contact.info.email")}</strong>
                <p>support@atlasads.ma</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="contact-form-section">
          <form className="pro-form" onSubmit={handleSubmit}>
            
            <div className="input-group">
              <label htmlFor="fullname">
                {t("contact.form.fullname")}
              </label>

              <input
                type="text"
                id="fullname"
                name="fullname"
                placeholder={t("contact.form.fullnamePlaceholder")}
                value={formData.fullname}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="email">
                {t("contact.form.email")}
              </label>

              <input
                type="email"
                id="email"
                name="email"
                placeholder="example@gmail.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="message">
                {t("contact.form.message")}
              </label>

              <textarea
                id="message"
                name="message"
                placeholder={t("contact.form.messagePlaceholder")}
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
                className="special"
              ></textarea>
            </div>

            <button
              type="submit"
              className="submit-button"
              disabled={status.type === "loading"}
            >
              {status.type === "loading"
                ? t("contact.form.sendingBtn")
                : t("contact.form.sendBtn")}
            </button>

            {status.msg && (
              <div className={`form-status-msg ${status.type}`}>
                {status.msg}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;