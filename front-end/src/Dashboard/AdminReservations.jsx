import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { CheckCircle, Search, XCircle } from "lucide-react";
import "./AdminReservations.css";

const formatDate = (date, locale = "en-GB") => {
  if (!date) return "-";
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "-";
  return parsedDate.toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatPrice = (price, locale = "en") =>
  `${Number(price || 0).toLocaleString(locale)} DH`;

const AdminReservations = () => {
  const { t, i18n } = useTranslation();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(false);
  const token = localStorage.getItem("token");
  const currentLanguage = (i18n.resolvedLanguage || i18n.language || "en")
    .slice(0, 2)
    .toLowerCase();

  const getDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return "-";
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
    return t("dashboard.reservations.durationDays", { count: days });
  };

  const fetchReservations = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/admin/reservations",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setReservations(response.data);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);
  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const handleUpdateStatus = async (id, newStatus) => {
    const isConfirming = newStatus === "confirmed";
    const result = await Swal.fire({
      title: isConfirming
        ? t("dashboard.reservations.confirmTitle")
        : t("dashboard.reservations.rejectTitle"),
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: isConfirming ? "#10b981" : "#ef4444",
      confirmButtonText: isConfirming
        ? t("dashboard.reservations.confirm")
        : t("dashboard.reservations.reject"),
      cancelButtonText: t("dashboard.common.cancel"),
    });
    if (!result.isConfirmed) return;
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/admin/reservations/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setReservations((prev) =>
        prev.map((res) =>
          res.id === id ? { ...res, status: newStatus } : res,
        ),
      );
    } catch (error) {
      console.error("Backend Error:", error);
      Swal.fire(
        t("dashboard.common.error"),
        t("dashboard.reservations.actionFailed"),
        "error",
      );
    }
  };

  const filteredReservations = useMemo(() => {
    return reservations.filter((res) => {
      const matchesStatus =
        filterStatus === "all" || res.status === filterStatus;
      const zone = res.billboard?.zone || "";
      const type = res.billboard?.type || "";
      const city = res.billboard?.city || "";
      const userName = res.user?.name || "";

      const text = `${userName} ${zone} ${type} ${city}`.toLowerCase();
      return matchesStatus && text.includes(searchTerm.toLowerCase());
    });
  }, [reservations, filterStatus, searchTerm]);
  const displayedData = showAll
    ? filteredReservations
    : filteredReservations.slice(0, 10);

  if (loading)
    return (
      <div className="loader-wrapper">
        <div className="custom-spinner"></div>
      </div>
    );

  return (
    <div className="admin-reservations-page">
      <header className="admin-header">
        <div>
          <p className="admin-panel">{t("dashboard.common.adminPanel")}</p>
          <h1>{t("dashboard.reservations.title")}</h1>
        </div>
      </header>

      <section className="admin-section">
        <div className="admin-res-card-header">
          <div className="actions-area">
            <div className="filters-group">
              <div className="search-box">
                <input
                  type="text"
                  placeholder={t("dashboard.reservations.search")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select
                className="status-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">
                  {t("dashboard.reservations.allStatus")}
                </option>
                <option value="pending">{t("dashboard.status.pending")}</option>
                <option value="confirmed">
                  {t("dashboard.status.confirmed")}
                </option>
                <option value="cancelled">
                  {t("dashboard.status.cancelled")}
                </option>
              </select>
            </div>

            {!showAll && filteredReservations.length > 10 && (
              <button className="btn-view-all" onClick={() => setShowAll(true)}>
                {t("dashboard.common.viewAll")}{" "}
                <span aria-hidden="true">&rarr;</span>
              </button>
            )}
          </div>
        </div>

        <div className="admin-res-table-wrap">
          <table className="admin-res-table">
            <thead>
              <tr>
                <th>{t("dashboard.reservations.table.client")}</th>
                <th>{t("dashboard.reservations.table.billboard")}</th>
                <th>{t("dashboard.reservations.table.city")}</th>
                <th>{t("dashboard.reservations.table.startDate")}</th>
                <th>{t("dashboard.reservations.table.duration")}</th>
                <th>{t("dashboard.reservations.table.price")}</th>
                <th>{t("dashboard.reservations.table.status")}</th>
                <th>{t("dashboard.reservations.table.actions")}</th>
              </tr>
            </thead>

            <tbody>
              {displayedData.map((res) => (
                <tr key={res.id}>
                  <td
                    data-label={t("dashboard.reservations.table.client")}
                    className="client-name"
                  >
                    {res.user?.name || t("dashboard.common.unknown")}
                  </td>

                  <td
                    data-label={t("dashboard.reservations.table.billboard")}
                    className="billboard-info"
                  >
                    <div className="billboard-details">
                      <span>
                        {res.billboard?.zone ||
                          t("dashboard.reservations.noZone")}{" "}
                        -{" "}
                      </span>
                      <span>
                        {res.billboard?.type ||
                          t("dashboard.reservations.noType")}
                      </span>
                    </div>
                  </td>

                  <td data-label={t("dashboard.reservations.table.city")}>
                    {res.billboard?.city}
                  </td>

                  <td data-label={t("dashboard.reservations.table.startDate")}>
                    {formatDate(res.start_date, currentLanguage)}
                  </td>

                  <td data-label={t("dashboard.reservations.table.duration")}>
                    {getDuration(res.start_date, res.end_date)}
                  </td>

                  <td
                    data-label={t("dashboard.reservations.table.price")}
                    className="price-val"
                  >
                    {formatPrice(res.total_price, currentLanguage)}
                  </td>

                  <td data-label={t("dashboard.reservations.table.status")}>
                    <span className={`status-pill ${res.status}`}>
                      {t(`dashboard.status.${res.status}`, {
                        defaultValue: res.status,
                      })}
                    </span>
                  </td>

                  <td data-label={t("dashboard.reservations.table.actions")}>
                    <div className="row-actions">
                      <button
                        className="action-btn confirm"
                        onClick={() => handleUpdateStatus(res.id, "confirmed")}
                        aria-label={t("dashboard.reservations.confirm")}
                      >
                        <CheckCircle size={18} />
                      </button>

                      <button
                        className="action-btn reject"
                        onClick={() => handleUpdateStatus(res.id, "rejected")}
                        aria-label={t("dashboard.reservations.reject")}
                      >
                        <XCircle size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminReservations;
