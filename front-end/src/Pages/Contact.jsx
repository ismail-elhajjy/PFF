import { useState } from "react";
import axios from "axios";
import "./Contact.css";
import { MapPin, Phone, Mail } from "lucide-react";

function Contact() {
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
    setStatus({ type: "loading", msg: "Sending your message..." });

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/contact",
        formData,
      );
      if (response.status === 201) {
        setStatus({
          type: "success",
          msg: "Thank you! Your message has been sent successfully.",
        });
        setFormData({ fullname: "", email: "", message: "" });

        setTimeout(() => setStatus({ type: "", msg: "" }), 5000);
      }
    } catch (error) {
      console.error("Error:", error);
      setStatus({
        type: "error",
        msg: "Connection error. Please try again later.",
      });
    }
  };

  return (
    <div className="contact-wrapper">
      {/*****************************/}
      {/*  Section 1: Contact Info  */}
      {/*****************************/}
      <div className="contact-container">
        <div className="contact-info">
          <h2>Get in Touch</h2>
          <p>
            Have questions about our billboards? Our team is here to help you
            grow your brand.
          </p>
          <div className="info-details">
            <div className="info-item">
              <span>
                <MapPin size={25} strokeWidth={2}/>
              </span>
              <div>
                <strong>Headquarters</strong>
                <p>Dar Bouazza, Casablanca, Morocco</p>
              </div>
            </div>
            <div className="info-item">
              <span>
                <Phone size={25} strokeWidth={2}/>
              </span>
              <div>
                <strong>Phone</strong>
                <p>+212 7 09 08 32 72</p>
              </div>
            </div>
            <div className="info-item">
              <span>
                <Mail  size={25} strokeWidth={2}/>
              </span>
              <div>
                <strong>Email</strong>
                <p>support@atlasads.ma</p>
              </div>
            </div>
          </div>
        </div>
        {/*****************************/}
        {/*  Section 2: Contact Form  */}
        {/*****************************/}
        <div className="contact-form-section">
          <form className="pro-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="fullname">Full Name</label>
              <input
                type="text"
                id="fullname"
                name="fullname"
                placeholder="Enter your full name"
                value={formData.fullname}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="email">Email Address</label>
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
              <label htmlFor="message">Your Message</label>
              <textarea
                id="message"
                name="message"
                placeholder="How can we assist you today?"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="submit-button"
              disabled={status.type === "loading"}
            >
              {status.type === "loading" ? "Sending..." : "Send Message"}
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
