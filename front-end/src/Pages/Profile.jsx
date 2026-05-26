import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import {
  CalendarDays,
  Download,
  Mail,
  ReceiptText,
  UserRound,
  WalletCards,
  MapPin,
} from "lucide-react";
import "./Profile.css";

const Profile = () => {
  const { t, i18n } = useTranslation();

  const rawData = localStorage.getItem("user");
  const parsedData = useMemo(
    () => (rawData ? JSON.parse(rawData) : {}),
    [rawData]
  );

  const user = parsedData.user ? parsedData.user : parsedData;

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userInitials = useMemo(() => {
    const name = user.name || "Atlas User";

    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }, [user.name]);

  const stats = useMemo(() => {
    const totalSpend = reservations.reduce((sum, reservation) => {
      return sum + Number(reservation.total_price || 0);
    }, 0);

    const confirmed = reservations.filter((reservation) => {
      return reservation.status?.toLowerCase() === "confirmed";
    }).length;

    return {
      total: reservations.length,
      confirmed,
      totalSpend,
    };
  }, [reservations]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://127.0.0.1:8000/api/my-reservations",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setReservations(response.data);
      } catch (error) {
        console.error("Error:", error);
        setError(t("profile.loadError"));
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [t]);

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Intl.DateTimeFormat(i18n.language, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  };

  const handleDownloadPDF = async (id) => {
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

    try {
      const token = localStorage.getItem("token");

      if (!token) throw new Error("No token found");

      Toast.fire({
        icon: "info",
        title: t("profile.generatingPdf"),
      });

      const response = await axios.get(
        `http://127.0.0.1:8000/api/reservations/pdf/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/pdf",
          },
          responseType: "blob",
        }
      );

      if (response.data.type !== "application/pdf") {
        Toast.fire({
          icon: "error",
          title: t("profile.invalidFile"),
        });
        return;
      }

      const url = window.URL.createObjectURL(
        new Blob([response.data], {
          type: "application/pdf",
        })
      );

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Invoice_AtlasAds_${id}.pdf`);
      document.body.appendChild(link);
      link.click();

      window.URL.revokeObjectURL(url);
      link.remove();

      Toast.fire({
        icon: "success",
        title: t("profile.downloadSuccess"),
      });
    } catch (error) {
      console.error(error);

      Toast.fire({
        icon: "error",
        title: t("profile.serverError"),
      });
    }
  };

  const handleCancelReservation = async (id) => {
    const result = await Swal.fire({
      title: t("profile.areYouSure"),
      text: t("profile.cancelWarning"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f97316",
      cancelButtonColor: "#d33",
      confirmButtonText: t("profile.confirmCancel"),
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");

        await axios.delete(
          `http://127.0.0.1:8000/api/reservations/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setReservations((prev) =>
          prev.filter((res) => res.id !== id)
        );

        Swal.fire(
          t("profile.cancelled"),
          t("profile.cancelSuccess"),
          "success"
        );
      } catch (error) {
        Swal.fire(
          t("profile.error"),
          t("profile.somethingWrong"),
          error
        );
      }
    }
  };

  return (
    <div className="profile-page">
      <section className="profile-hero">
        <div className="profile-identity">
          <div className="profile-avatar">
            {userInitials}
          </div>

          <div>
            <span className="profile-eyebrow">
              {t("profile.myAccount")}
            </span>

            <h1>{user.name || "Atlas User"}</h1>

            <p>
              <Mail size={16} />
              {user.email || t("profile.emailNotFound")}
            </p>
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat-box">
            <ReceiptText size={20} />
            <span>{stats.total}</span>
            <p>{t("profile.reservations")}</p>
          </div>

          <div className="stat-box">
            <CalendarDays size={20} />
            <span>{stats.confirmed}</span>
            <p>{t("profile.confirmed")}</p>
          </div>

          <div className="stat-box">
            <WalletCards size={20} />
            <span>{stats.totalSpend.toLocaleString()} DH</span>
            <p>{t("profile.totalSpent")}</p>
          </div>
        </div>
      </section>

      <section className="reservations-section">
        <div className="section-heading">
          <div>
            <span className="profile-eyebrow">
              {t("profile.history")}
            </span>

            <h2>{t("profile.bookings")}</h2>
          </div>
        </div>

        {loading && (
          <div className="profile-state">
            <div className="profile-spinner"></div>
            <p>{t("profile.loadingReservations")}</p>
          </div>
        )}

        {!loading && error && (
          <div className="profile-state error-state">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && reservations.length === 0 && (
          <div className="profile-state">
            <UserRound size={38} />
            <h3>{t("profile.noReservations")}</h3>
            <p>{t("profile.noReservationsDesc")}</p>
          </div>
        )}

        {!loading && !error && reservations.length > 0 && (
          <div className="table-container">
            <table className="profile-table">
              <thead>
                <tr>
                  <th>{t("profile.billboard")}</th>
                  <th>{t("profile.type")}</th>
                  <th>{t("profile.size")}</th>
                  <th>{t("profile.startDate")}</th>
                  <th>{t("profile.endDate")}</th>
                  <th>{t("profile.price")}</th>
                  <th>{t("profile.status")}</th>
                  <th>{t("profile.action")}</th>
                </tr>
              </thead>

              <tbody>
                {reservations.map((res) => {
                  const status = res.status || "pending";

                  return (
                    <tr key={res.id}>
                      <td>
                        <span className="billboard-name">
                          {res.billboard?.title || "N/A"}
                        </span>

                        <div className="billboard-location">
                          <MapPin size={12} />
                          <span>
                            {res.billboard?.city}, {res.billboard?.zone}
                          </span>
                        </div>
                      </td>

                      <td>{res.billboard?.type || "Standard"}</td>
                      <td>{res.billboard?.size || "N/A"}</td>
                      <td>{formatDate(res.start_date)}</td>
                      <td>{formatDate(res.end_date)}</td>

                      <td>
                        {parseInt(res.total_price)} DH
                      </td>

                      <td>
                        <span className={`status-tag ${status.toLowerCase()}`}>
                          {status}
                        </span>
                      </td>

                      <td>
                        <div className="action-wrapper">
                          {res.status?.toLowerCase() === "pending" && (
                            <button
                              onClick={() =>
                                handleCancelReservation(res.id)
                              }
                              className="cancel-btn"
                            >
                              {t("profile.cancel")}
                            </button>
                          )}

                          <button
                            onClick={() =>
                              handleDownloadPDF(res.id)
                            }
                            className="pdf-btn"
                          >
                            <Download size={16} />
                            {t("profile.pdf")}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default Profile;