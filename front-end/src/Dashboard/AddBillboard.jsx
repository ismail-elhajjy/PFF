import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import {
  ArrowLeft,
  Upload,
  Save,
  CheckCircle,
  FileText,
  X,
  Pencil,
  Trash2,
  PlusCircle,
  RotateCcw,
  MapPin,
} from "lucide-react";
import { getBillboardImageUrl } from "../utils/billboardMedia";
import "./AddBillboard.css";

const emptyForm = {
  title: "",
  city: "",
  zone: "",
  type: "LED",
  size: "",
  price: "",
  is_available: "1",
  image: null,
};

const AddBillboard = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const formRef = useRef(null);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [billboardsLoading, setBillboardsLoading] = useState(true);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [billboards, setBillboards] = useState([]);
  const [editingBillboard, setEditingBillboard] = useState(null);

  const [formData, setFormData] = useState(emptyForm);
  const currentLanguage = (i18n.resolvedLanguage || i18n.language || "en")
    .slice(0, 2)
    .toLowerCase();

  const Toast = Swal.mixin({
    toast: true,
    position: "bottom-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  const fetchBillboards = async () => {
    setBillboardsLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/billboards");
      setBillboards(response.data.data || []);
    } catch (error) {
      console.error("Billboards fetch error:", error);
      Toast.fire({
        icon: "error",
        title: t("dashboard.billboards.messages.loadError"),
      });
    } finally {
      setBillboardsLoading(false);
    }
  };

  useEffect(() => {
    fetchBillboards();
  }, []);

  const resetForm = () => {
    setFormData(emptyForm);
    setSelectedFileName("");
    setEditingBillboard(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((previous) => ({ ...previous, image: file }));
      setSelectedFileName(file.name);
    }
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setFormData((previous) => ({ ...previous, image: null }));
    setSelectedFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const buildPayload = () => {
    const data = new FormData();

    data.append("title", formData.title);
    data.append("city", formData.city);
    data.append("zone", formData.zone);
    data.append("type", formData.type);
    data.append("size", formData.size);
    data.append("price", formData.price);
    data.append("is_available", formData.is_available);

    if (formData.image) {
      data.append("image", formData.image);
    }

    return data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editingBillboard && !formData.image) {
      Toast.fire({
        icon: "warning",
        title: t("dashboard.billboards.messages.imageRequired"),
      });
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const data = buildPayload();

      if (editingBillboard) {
        data.append("_method", "PUT");
        await axios.post(
          `http://127.0.0.1:8000/api/admin/billboards/${editingBillboard.id}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );

        Toast.fire({
          icon: "success",
          title: t("dashboard.billboards.messages.updated"),
        });
      } else {
        await axios.post("http://127.0.0.1:8000/api/admin/billboards", data, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        Toast.fire({
          icon: "success",
          title: t("dashboard.billboards.messages.added"),
        });
      }

      resetForm();
      fetchBillboards();
    } catch (error) {
      console.error("Error:", error.response?.data);

      Toast.fire({
        icon: "error",
        title: error.response?.data?.message || t("dashboard.common.somethingWrong"),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (billboard) => {
    setEditingBillboard(billboard);
    setFormData({
      title: billboard.title || "",
      city: billboard.city || "",
      zone: billboard.zone || "",
      type: billboard.type || "LED",
      size: billboard.size || "",
      price: billboard.price || "",
      is_available: billboard.is_available ? "1" : "0",
      image: null,
    });
    setSelectedFileName(
      billboard.image
        ? `${t("dashboard.billboards.form.currentFile")}: ${billboard.image}`
        : "",
    );

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  };

  const handleDelete = async (billboard) => {
    const result = await Swal.fire({
      title: t("dashboard.billboards.deleteTitle"),
      text: t("dashboard.billboards.deleteText", { title: billboard.title }),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: t("dashboard.common.deleteConfirm"),
      cancelButtonText: t("dashboard.common.cancel"),
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://127.0.0.1:8000/api/admin/billboards/${billboard.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      Toast.fire({
        icon: "success",
        title: t("dashboard.billboards.messages.deleted"),
      });

      if (editingBillboard?.id === billboard.id) {
        resetForm();
      }
      fetchBillboards();
    } catch (error) {
      console.error("Delete error:", error.response?.data);
      Toast.fire({
        icon: "error",
        title: error.response?.data?.message || t("dashboard.billboards.messages.deleteError"),
      });
    }
  };

  return (
    <div className="billboard-page-wrapper">
      <div className="billboard-top-section">
        <button className="billboard-back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} /> {t("dashboard.common.back")}
        </button>
        <div>
          <span className="billboard-page-eyebrow">
            {t("dashboard.billboards.eyebrow")}
          </span>
          <h1>
            {editingBillboard
              ? t("dashboard.billboards.updateTitle")
              : t("dashboard.billboards.addTitle")}
          </h1>
        </div>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="billboard-create-form">
        <div className="billboard-form-heading">
          <div>
            <h2>
              {editingBillboard
                ? t("dashboard.billboards.editHeading")
                : t("dashboard.billboards.createHeading")}
            </h2>
            <p>
              {editingBillboard
                ? t("dashboard.billboards.editDescription")
                : t("dashboard.billboards.createDescription")}
            </p>
          </div>

          {editingBillboard && (
            <button
              type="button"
              className="billboard-reset-button"
              onClick={resetForm}
            >
              <RotateCcw size={16} />
              {t("dashboard.billboards.cancelEdit")}
            </button>
          )}
        </div>

        <div className="billboard-fields-grid">
          <div className="billboard-field-box">
            <label>{t("dashboard.billboards.form.title")}</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder={t("dashboard.billboards.form.titlePlaceholder")}
            />
          </div>

          <div className="billboard-field-box">
            <label>{t("dashboard.billboards.form.city")}</label>
            <input
              type="text"
              name="city"
              required
              value={formData.city}
              onChange={handleChange}
              placeholder={t("dashboard.billboards.form.cityPlaceholder")}
            />
          </div>

          <div className="billboard-field-box">
            <label>{t("dashboard.billboards.form.zone")}</label>
            <input
              type="text"
              name="zone"
              required
              value={formData.zone}
              onChange={handleChange}
              placeholder={t("dashboard.billboards.form.zonePlaceholder")}
            />
          </div>

          <div className="billboard-field-box">
            <label>{t("dashboard.billboards.form.type")}</label>
            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="LED">LED</option>
              <option value="Digital">{t("dashboard.billboards.types.digital")}</option>
              <option value="Classic">{t("dashboard.billboards.types.classic")}</option>
            </select>
          </div>

          <div className="billboard-field-box">
            <label>{t("dashboard.billboards.form.size")}</label>
            <input
              type="text"
              name="size"
              required
              value={formData.size}
              onChange={handleChange}
              placeholder={t("dashboard.billboards.form.sizePlaceholder")}
            />
          </div>

          <div className="billboard-field-box">
            <label>{t("dashboard.billboards.form.price")}</label>
            <input
              type="number"
              name="price"
              required
              value={formData.price}
              onChange={handleChange}
              placeholder={t("dashboard.billboards.form.pricePlaceholder")}
            />
          </div>

          <div className="billboard-field-box">
            <label>{t("dashboard.billboards.form.availability")}</label>
            <select
              name="is_available"
              value={formData.is_available}
              onChange={handleChange}
            >
              <option value="1">{t("dashboard.status.available")}</option>
              <option value="0">{t("dashboard.status.unavailable")}</option>
            </select>
          </div>

          <div className="billboard-field-box full-width">
            <label>{t("dashboard.billboards.form.image")}</label>
            <div
              className={`billboard-upload-area ${selectedFileName ? "file-selected" : ""}`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                required={!editingBillboard && !selectedFileName}
                onChange={handleFileChange}
              />

              {!selectedFileName ? (
                <div className="upload-placeholder">
                  <Upload size={24} className="upload-icon" />
                  <span>{t("dashboard.billboards.form.upload")}</span>
                </div>
              ) : (
                <div className="file-signal">
                  <div className="file-info">
                    <FileText size={20} className="file-icon" />
                    <span className="file-name">{selectedFileName}</span>
                    <CheckCircle size={18} className="check-icon" />
                  </div>
                  <button
                    type="button"
                    className="clear-file-btn"
                    onClick={removeFile}
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="billboard-save-button"
          disabled={loading}
        >
          {loading ? (
            t("dashboard.common.saving")
          ) : (
            <>
              {editingBillboard ? <Pencil size={18} /> : <Save size={18} />}
              {editingBillboard
                ? t("dashboard.billboards.updateButton")
                : t("dashboard.billboards.saveButton")}
            </>
          )}
        </button>
      </form>

      <section className="billboard-manage-section">
        <div className="billboard-manage-header">
          <div>
            <span className="billboard-page-eyebrow">
              {t("dashboard.billboards.database")}
            </span>
            <h2>{t("dashboard.billboards.manageTitle")}</h2>
            <p>{t("dashboard.billboards.manageDescription")}</p>
          </div>

          <button className="billboard-refresh-button" onClick={fetchBillboards}>
            <PlusCircle size={17} />
            {t("dashboard.billboards.refresh")}
          </button>
        </div>

        {billboardsLoading ? (
          <div className="billboard-admin-state">
            <div className="billboard-admin-spinner"></div>
            <p>{t("dashboard.billboards.loading")}</p>
          </div>
        ) : billboards.length === 0 ? (
          <div className="billboard-admin-state">
            <p>{t("dashboard.billboards.empty")}</p>
          </div>
        ) : (
          <div className="billboard-admin-grid">
            {billboards.map((billboard) => (
              <article
                key={billboard.id}
                className={`billboard-admin-card ${
                  editingBillboard?.id === billboard.id ? "is-editing" : ""
                }`}
              >
                <div className="billboard-admin-image">
                  <img
                    src={getBillboardImageUrl(billboard.image)}
                    alt={billboard.title}
                  />
                  <span
                    className={`billboard-admin-status ${
                      billboard.is_available ? "available" : "unavailable"
                    }`}
                  >
                    {billboard.is_available
                      ? t("dashboard.status.available")
                      : t("dashboard.status.unavailable")}
                  </span>
                </div>

                <div className="billboard-admin-content">
                  <h3>{billboard.title}</h3>
                  <p>
                    <MapPin size={15} />
                    {billboard.city}, {billboard.zone}
                  </p>

                  <div className="billboard-admin-tags">
                    <span>{billboard.type}</span>
                    <span>{billboard.size}</span>
                  </div>

                  <div className="billboard-admin-footer">
                    <strong>
                      {Number(billboard.price).toLocaleString(currentLanguage)} MAD
                    </strong>
                    <div className="billboard-admin-actions">
                      <button
                        type="button"
                        className="billboard-edit-button"
                        onClick={() => handleEdit(billboard)}
                      >
                        <Pencil size={16} />
                        {t("dashboard.common.update")}
                      </button>

                      <button
                        type="button"
                        className="billboard-delete-button"
                        onClick={() => handleDelete(billboard)}
                      >
                        <Trash2 size={16} />
                        {t("dashboard.common.delete")}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AddBillboard;
