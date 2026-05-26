import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Search,
  Bell,
  Plus,
  FileText,
  TrendingUp,
  TrendingDown,
  LayoutGrid,
  Calendar,
  Users,
  ArrowUpRight,
  Globe2,
} from "lucide-react";

import "./AdminDashboard.css";


const getStoredAdmin = () => {
  try {
    const rawUser = localStorage.getItem("user");
    if (!rawUser) return {};

    const parsedUser = JSON.parse(rawUser);
    return parsedUser.user || parsedUser;
  } catch (error) {
    console.error("Invalid dashboard user data:", error);
    return {};
  }
};

const getInitials = (name) => {
  if (!name) return "AD";

  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return initials || "AD";
};

const formatContactDate = (date, locale = "en-GB") => {
  if (!date) return "-";

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "-";

  return parsedDate.toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const RevenueBarChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
      <XAxis
        dataKey="month"
        axisLine={false}
        tickLine={false}
        tick={{ fill: "#6b7280", fontSize: 12 }}
      />
      <YAxis
        axisLine={false}
        tickLine={false}
        tick={{ fill: "#6b7280", fontSize: 12 }}
      />
      <Tooltip
        cursor={{ fill: "#f3f4f6" }}
        contentStyle={{
          borderRadius: "8px",
          border: "none",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      />
      <Bar
        dataKey="revenue"
        fill="#f97316"
        radius={[4, 4, 0, 0]}
        barSize={30}
      />
    </BarChart>
  </ResponsiveContainer>
);

const PanelDonutChart = ({ data }) => {
  const COLORS = ["#f97316", "#0f172a", "#94a3b8"];
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend verticalAlign="bottom" height={36} iconType="circle" />
      </PieChart>
    </ResponsiveContainer>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [contactMessages, setContactMessages] = useState([]);
  const [contactsLoading, setContactsLoading] = useState(true);
  const [contactSearch, setContactSearch] = useState("");
  const token = localStorage.getItem("token");
  const admin = useMemo(() => getStoredAdmin(), []);
  const adminName = admin.name || "Admin";
  const adminInitials = getInitials(adminName);
  const currentLanguage = (i18n.resolvedLanguage || i18n.language || "en")
    .slice(0, 2)
    .toLowerCase();

  const handleLanguageChange = (event) => {
    const nextLanguage = event.target.value;
    i18n.changeLanguage(nextLanguage);
    document.body.dir = nextLanguage === "ar" ? "rtl" : "ltr";
  };

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/notifications",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setNotifications(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleMarkAsRead = async () => {
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/notifications/mark-as-read",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setNotifications([]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/admin/stats",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setData(response.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchContactMessages = async () => {
      setContactsLoading(true);
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/admin/contacts",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setContactMessages(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching contact messages:", error);
        setContactMessages([]);
      } finally {
        setContactsLoading(false);
      }
    };

    fetchDashboardData();
    fetchNotifications();
    fetchContactMessages();

    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [token]);

  const filteredContactMessages = useMemo(() => {
    const search = contactSearch.trim().toLowerCase();
    if (!search) return contactMessages;

    return contactMessages.filter((contact) => {
      const text = `${contact.fullname || ""} ${contact.email || ""} ${
        contact.message || ""
      }`.toLowerCase();
      return text.includes(search);
    });
  }, [contactMessages, contactSearch]);

  
  if (loading)
    return (
      <div className="admin-loading-wrapper">
        <div className="admin-loading-spinner"></div>
      </div>
    );

  if (!data) return <div className="admin-error-box">{t("dashboard.common.noData")}</div>;

  return (
    <div className="admin-dashboard-wrapper">

      {/* -------------- */}
      {/* Header section */}
      {/* -------------- */}
      <div className="admin-header-section">
        <h1>{t("dashboard.overview.title")}</h1>
        <div className="admin-header-tools">

          <div className="admin-profile-tools">
            <div className="admin-language-switcher" title={t("dashboard.common.language")}>
              <Globe2 size={18} />
              <select
                aria-label={t("dashboard.common.language")}
                value={currentLanguage}
                onChange={handleLanguageChange}
              >
                <option value="en">EN</option>
                <option value="fr">FR</option>
                <option value="ar">AR</option>
              </select>
            </div>

            <div
              className="admin-notification-wrapper"
              onClick={() => setShowNotifications(!showNotifications)}
              title={t("dashboard.notifications.title")}
            >
              <Bell size={20} />
              {notifications.length > 0 && (
                <span className="admin-notification-badge">
                  {notifications.length}
                </span>
              )}

              {showNotifications && (
                <div className="admin-notification-menu">
                  <h3>{t("dashboard.notifications.title")}</h3>
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div key={n.id} className="notification-item">
                        <p>
                          {n.data.client_name && n.data.billboard_title
                            ? t("dashboard.notifications.newReservation", {
                                client: n.data.client_name,
                                billboard: n.data.billboard_title,
                              })
                            : n.data.message}
                        </p>
                        <small>
                          {new Date(n.created_at).toLocaleTimeString(currentLanguage)}
                        </small>
                      </div>
                    ))
                  ) : (
                    <p className="no-notifications">
                      {t("dashboard.notifications.empty")}
                    </p>
                  )}
                  {notifications.length > 0 && (
                    <button
                      onClick={handleMarkAsRead}
                      className="mark-read-btn"
                    >
                      {t("dashboard.notifications.markAllRead")}
                    </button>
                  )}
                </div>
              )}
            </div>

            <div
              className="admin-profile-avatar"
              onClick={() => navigate("/admin/settings")}
              title={adminName}
            >
              {adminInitials}
            </div>
          </div>

        </div>
      </div>
      <div className="admin-action-buttons">
        <button
          className="admin-add-billboard-btn"
          onClick={() => navigate("/admin/billboards/new")}
        >
          <Plus size={18} />
          {t("dashboard.overview.addBillboard")}
        </button>
      </div>

      {/* --------------- */}
      {/*   State Cards   */}
      {/* --------------- */}
      <div className="admin-stats-wrapper">
        {/* -------- */}
        {/*  Card 1  */}
        {/* -------- */}
        <div className="admin-stat-box">
          <div className="admin-stat-header">
            <div className="admin-stat-icon">
              <LayoutGrid size={20} />
            </div>

            <span className="admin-stat-trend positive">
              <TrendingUp size={14} /> +12%
            </span>
          </div>

          <h2>{data.stats.total_billboards}</h2>
          <p>{t("dashboard.overview.stats.totalBillboards")}</p>
        </div>

        {/* -------- */}
        {/*  Card 2  */}
        {/* -------- */}
        <div className="admin-stat-box">
          <div className="admin-stat-header">
            <div className="admin-stat-icon">
              <Calendar size={20} />
            </div>

            <span className="admin-stat-trend positive">
              <TrendingUp size={14} /> +8%
            </span>
          </div>

          <h2>{data.stats.active_reservations}</h2>
          <p>{t("dashboard.overview.stats.activeReservations")}</p>
        </div>

        {/* -------- */}
        {/*  Card 3  */}
        {/* -------- */}
        <div className="admin-stat-box">

          <div className="admin-stat-header">
            <div className="admin-stat-icon">
              <ArrowUpRight size={20} />
            </div>
            <span className="admin-stat-trend positive">
              <TrendingUp size={14} /> +18%
            </span>
          </div>

          <h2>{data.stats.total_revenue.toLocaleString(currentLanguage)} DH</h2>
          <p>{t("dashboard.overview.stats.monthlyRevenue")}</p>

        </div>

        {/* -------- */}
        {/*  Card 4  */}
        {/* -------- */}
        <div className="admin-stat-box">

          <div className="admin-stat-header">
            <div className="admin-stat-icon">
              <Users size={20} />
            </div>
            <span className="admin-stat-trend negative">
              <TrendingDown size={14} /> -3%
            </span>
          </div>

          <h2>{data.stats.total_users}</h2>
          <p>{t("dashboard.overview.stats.totalUsers")}</p>
        </div>

      </div>


      {/* --------------- */}
      {/*   Charts Grid   */}
      {/* --------------- */}
      <div className="admin-charts-grid">
        <div className="admin-chart-container main-chart">
          <div className="chart-header">
            <h3>{t("dashboard.overview.charts.revenue")}</h3>
          </div>
          <RevenueBarChart data={data.charts.revenue_history} />
        </div>

        <div className="admin-chart-container side-chart">
          <div className="chart-header">
            <h3>{t("dashboard.overview.charts.types")}</h3>
          </div>
          <PanelDonutChart data={data.charts.panel_types} />
        </div>
      </div>


      {/* --------------- */}
      {/*  contact msg   */}
      {/* --------------- */}
      <section className="admin-contact-section">
        <div className="admin-contact-header">
          <div>
            <p className="admin-contact-kicker">
              {t("dashboard.contacts.kicker")}
            </p>
            <h3>{t("dashboard.contacts.title")}</h3>
          </div>

          <div className="admin-contact-search">
            <Search size={16} />
            <input
              type="text"
              placeholder={t("dashboard.contacts.search")}
              value={contactSearch}
              onChange={(event) => setContactSearch(event.target.value)}
            />
          </div>
        </div>

        {contactsLoading ? (
          <div className="admin-contact-state">
            <div className="admin-contact-spinner"></div>
          </div>
        ) : filteredContactMessages.length > 0 ? (
          <div className="admin-contact-list">
            {filteredContactMessages.map((contact) => (
              <article className="admin-contact-card" key={contact.id}>
                <div className="admin-contact-avatar">
                  {getInitials(contact.fullname)}
                </div>

                <div className="admin-contact-content">
                  <div className="admin-contact-meta">
                    <div>
                      <h4>{contact.fullname}</h4>
                      <a href={`mailto:${contact.email}`}>{contact.email}</a>
                    </div>
                    <span>
                      {formatContactDate(contact.created_at, currentLanguage)}
                    </span>
                  </div>

                  <p>{contact.message}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="admin-contact-state">
            <FileText size={34} />
            <p>{t("dashboard.contacts.empty")}</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
