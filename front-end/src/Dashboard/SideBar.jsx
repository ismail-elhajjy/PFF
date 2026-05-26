import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Monitor,
  CalendarCheck,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import "./SideBar.css";

const getStoredAdmin = () => {
  try {
    const rawUser = localStorage.getItem("user");
    if (!rawUser) return {};

    const parsedUser = JSON.parse(rawUser);
    return parsedUser.user || parsedUser;
  } catch (error) {
    console.error("Invalid sidebar user data:", error);
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

const Sidebar = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const admin = useMemo(() => getStoredAdmin(), []);
  const adminName = admin.name || "Admin";
  const adminInitials = getInitials(adminName);

  const closeSidebar = () => setSidebarOpen(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
    window.location.reload();
  };

  return (
    <>
      <button
        className="menu-toggle1"
        onClick={() => setSidebarOpen((open) => !open)}
        aria-label={
          sidebarOpen
            ? t("dashboard.sidebar.closeMenu")
            : t("dashboard.sidebar.openMenu")
        }
      >
        {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar}></div>
      )}

      <div className={`admin-sidebar ${sidebarOpen ? "active" : ""}`}>
        <div className="sidebar-logo">
          <span className="logo-icon">A</span>
          <h2>AtlasAds</h2>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/admin/dashboard"
            onClick={closeSidebar}
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <LayoutDashboard size={20} />
            <span>{t("dashboard.sidebar.dashboard")}</span>
          </NavLink>

          <NavLink
            to="/admin/billboards/new"
            onClick={closeSidebar}
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <Monitor size={20} />
            <span>{t("dashboard.sidebar.billboards")}</span>
          </NavLink>

          <NavLink
            to="/admin/reservations"
            onClick={closeSidebar}
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <CalendarCheck size={20} />
            <span>{t("dashboard.sidebar.reservations")}</span>
          </NavLink>

          <NavLink
            to="/admin/users"
            onClick={closeSidebar}
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <Users size={20} />
            <span>{t("dashboard.sidebar.users")}</span>
          </NavLink>

          <NavLink
            to="/admin/settings"
            onClick={closeSidebar}
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            <Settings size={20} />
            <span>{t("dashboard.sidebar.settings")}</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="admin-profile">
            <div className="avatar">{adminInitials}</div>
            <div className="admin-info">
              <p className="admin-title">{t("dashboard.common.admin")}</p>
              <p className="admin-name">{adminName}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="logout-btn"
            title={t("dashboard.common.logout")}
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
