import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import {
  Bell,
  CheckCircle2,
  Clock3,
  Globe2,
  KeyRound,
  LogOut,
  Mail,
  MonitorCog,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import "./Settings.css";

const API_BASE_URL = "http://127.0.0.1:8000/api";

const defaultProfile = {
  name: "Admin",
  email: "admin@atlasads.ma",
  phone: "",
  role: "admin",
};

const defaultPreferences = {
  emailNotifications: true,
  reservationAlerts: true,
  weeklyReports: false,
  language: "English",
  timezone: "Africa/Casablanca",
};

const languageToCode = {
  English: "en",
  French: "fr",
  Arabic: "ar",
};

const codeToLanguage = {
  en: "English",
  fr: "French",
  ar: "Arabic",
};

const getStoredUser = () => {
  try {
    const rawUser = localStorage.getItem("user");
    if (!rawUser) return {};

    const parsed = JSON.parse(rawUser);
    return parsed.user || parsed;
  } catch (error) {
    console.error("Invalid user data in localStorage:", error);
    return {};
  }
};

const getStoredPreferences = () => {
  try {
    const rawPreferences = localStorage.getItem("adminSettings");
    return rawPreferences ? JSON.parse(rawPreferences) : {};
  } catch (error) {
    console.error("Invalid admin settings in localStorage:", error);
    return {};
  }
};

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const persistUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("role", user.role);
};

const Settings = () => {
  const { t, i18n } = useTranslation();
  const tRef = useRef(t);
  const detectedAdminLanguage =
    codeToLanguage[
      (i18n.resolvedLanguage || i18n.language || "en").slice(0, 2).toLowerCase()
    ] || defaultPreferences.language;
  const [profileForm, setProfileForm] = useState({
    ...defaultProfile,
    ...getStoredUser(),
  });
  const [securityForm, setSecurityForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [preferences, setPreferences] = useState({
    ...defaultPreferences,
    language: detectedAdminLanguage,
    ...getStoredPreferences(),
    ...(getStoredUser().admin_preferences || {}),
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState("");

  useEffect(() => {
    tRef.current = t;
  }, [t]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/admin/settings`, {
          headers: getAuthHeaders(),
        });

        const nextUser = response.data.user || {};
        const nextPreferences = response.data.preferences || {};

        setProfileForm({ ...defaultProfile, ...nextUser });
        setPreferences({ ...defaultPreferences, ...nextPreferences });
        persistUser(nextUser);
        localStorage.setItem("adminSettings", JSON.stringify(nextPreferences));
      } catch (error) {
        console.error("Settings load error:", error);
        Swal.fire(
          tRef.current("dashboard.settings.unavailable"),
          error.response?.data?.message ||
            tRef.current("dashboard.settings.loadError"),
          "error",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const initials = useMemo(() => {
    return (
      profileForm.name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase() || "AD"
    );
  }, [profileForm.name]);

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfileForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSecurityChange = (event) => {
    const { name, value } = event.target;
    setSecurityForm((previous) => ({ ...previous, [name]: value }));
  };

  const handlePreferenceChange = (event) => {
    const { name, value, checked, type } = event.target;
    if (name === "language") {
      const nextLanguage = languageToCode[value];
      if (nextLanguage) {
        i18n.changeLanguage(nextLanguage);
        document.body.dir = nextLanguage === "ar" ? "rtl" : "ltr";
      }
    }
    setPreferences((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const saveProfile = async (event) => {
    event.preventDefault();

    if (!profileForm.name.trim() || !profileForm.email.trim()) {
      Swal.fire(
        t("dashboard.common.missingInfo"),
        t("dashboard.settings.nameEmailRequired"),
        "warning",
      );
      return;
    }

    setSaving("profile");
    try {
      const response = await axios.put(
        `${API_BASE_URL}/admin/settings/profile`,
        {
          name: profileForm.name,
          email: profileForm.email,
          phone: profileForm.phone,
        },
        { headers: getAuthHeaders() },
      );

      const nextUser = response.data.user;
      setProfileForm({ ...defaultProfile, ...nextUser });
      persistUser(nextUser);
      Swal.fire(
        t("dashboard.common.saved"),
        t("dashboard.settings.profileSaved"),
        "success",
      );
    } catch (error) {
      console.error("Profile save error:", error);
      Swal.fire(
        t("dashboard.settings.profileNotSaved"),
        error.response?.data?.message || t("dashboard.settings.profileCheck"),
        "error",
      );
    } finally {
      setSaving("");
    }
  };

  const saveSecurity = async (event) => {
    event.preventDefault();

    if (!securityForm.currentPassword || !securityForm.newPassword) {
      Swal.fire(
        t("dashboard.common.missingInfo"),
        t("dashboard.settings.fillPassword"),
        "warning",
      );
      return;
    }

    if (securityForm.newPassword.length < 6) {
      Swal.fire(
        t("dashboard.settings.weakPassword"),
        t("dashboard.settings.passwordLength"),
        "warning",
      );
      return;
    }

    if (securityForm.newPassword !== securityForm.confirmPassword) {
      Swal.fire(
        t("dashboard.settings.passwordMismatch"),
        t("dashboard.settings.passwordMismatchText"),
        "error",
      );
      return;
    }

    setSaving("security");
    try {
      await axios.put(
        `${API_BASE_URL}/admin/settings/password`,
        {
          current_password: securityForm.currentPassword,
          password: securityForm.newPassword,
          password_confirmation: securityForm.confirmPassword,
        },
        { headers: getAuthHeaders() },
      );

      setSecurityForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      Swal.fire(
        t("dashboard.common.saved"),
        t("dashboard.settings.passwordSaved"),
        "success",
      );
    } catch (error) {
      console.error("Password save error:", error);
      Swal.fire(
        t("dashboard.settings.passwordNotChanged"),
        error.response?.data?.message || t("dashboard.settings.verifyPassword"),
        "error",
      );
    } finally {
      setSaving("");
    }
  };

  const savePreferences = async () => {
    setSaving("preferences");
    try {
      const response = await axios.put(
        `${API_BASE_URL}/admin/settings/preferences`,
        preferences,
        { headers: getAuthHeaders() },
      );

      const nextPreferences = response.data.preferences;
      setPreferences({ ...defaultPreferences, ...nextPreferences });
      localStorage.setItem("adminSettings", JSON.stringify(nextPreferences));
      Swal.fire(
        t("dashboard.common.saved"),
        t("dashboard.settings.preferencesSaved"),
        "success",
      );
    } catch (error) {
      console.error("Preferences save error:", error);
      Swal.fire(
        t("dashboard.settings.preferencesNotSaved"),
        error.response?.data?.message ||
          t("dashboard.settings.preferencesError"),
        "error",
      );
    } finally {
      setSaving("");
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: t("dashboard.settings.logoutTitle"),
      text: t("dashboard.settings.logoutText"),
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#f97316",
      cancelButtonColor: "#64748b",
      confirmButtonText: t("dashboard.common.logout"),
      cancelButtonText: t("dashboard.common.cancel"),
    }).then((result) => {
      if (!result.isConfirmed) return;
      localStorage.clear();
      window.location.href = "/login";
    });
  };

  if (loading) {
    return (
      <div className="settings-loading">
        <div className="settings-spinner"></div>
      </div>
    );
  }

  return (
    <div className="settings-page">
      <header className="settings-header">
        <div>
          <span className="settings-eyebrow">
            {t("dashboard.common.adminPanel")}
          </span>
          <h1>{t("dashboard.settings.title")}</h1>
          <p>{t("dashboard.settings.subtitle")}</p>
        </div>

        <button className="settings-logout-btn" onClick={handleLogout}>
          <LogOut size={18} />
          {t("dashboard.common.logout")}
        </button>
      </header>

      <section className="settings-hero">
        <div className="settings-profile-summary">
          <div className="settings-avatar">{initials}</div>
          <div>
            <span>{t("dashboard.settings.signedInAs")}</span>
            <h2>{profileForm.name}</h2>
            <p>
              <Mail size={16} />
              {profileForm.email}
            </p>
          </div>
        </div>

        <div className="settings-health-grid">
          <div className="settings-health-card">
            <ShieldCheck size={20} />
            <div>
              <strong>{t("dashboard.settings.health.adminAccess")}</strong>
              <span>{t("dashboard.settings.health.protectedRoute")}</span>
            </div>
          </div>

          <div className="settings-health-card">
            <Clock3 size={20} />
            <div>
              <strong>{t("dashboard.settings.health.timezone")}</strong>
              <span>{preferences.timezone}</span>
            </div>
          </div>

          <div className="settings-health-card">
            <CheckCircle2 size={20} />
            <div>
              <strong>{t("dashboard.settings.health.databaseSync")}</strong>
              <span>{t("dashboard.settings.health.preferencesSaved")}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="settings-grid">
        <form className="settings-card" onSubmit={saveProfile}>
          <div className="settings-card-header">
            <span className="settings-card-icon">
              <UserRound size={20} />
            </span>
            <div>
              <h3>{t("dashboard.settings.profile.title")}</h3>
              <p>{t("dashboard.settings.profile.description")}</p>
            </div>
          </div>

          <div className="settings-form-grid edit">
            <label>
              {t("dashboard.settings.profile.fullName")}
              <input
                type="text"
                name="name"
                value={profileForm.name}
                onChange={handleProfileChange}
              />
            </label>

            <label>
              {t("dashboard.settings.profile.email")}
              <input
                type="email"
                name="email"
                value={profileForm.email}
                onChange={handleProfileChange}
              />
            </label>

            <label>
              {t("dashboard.settings.profile.phone")}
              <input
                type="tel"
                name="phone"
                placeholder="+212 6 00 00 00 00"
                value={profileForm.phone || ""}
                onChange={handleProfileChange}
              />
            </label>

            <label>
              {t("dashboard.settings.profile.role")}
              <input
                type="text"
                name="role"
                value={t(`dashboard.roles.${profileForm.role}`, {
                  defaultValue: profileForm.role,
                })}
                disabled
              />
            </label>
          </div>

          <button
            className="settings-primary-btn save-profile"
            type="submit"
            disabled={saving === "profile"}
          >
            <Save size={18} />
            {saving === "profile"
              ? t("dashboard.common.saving")
              : t("dashboard.settings.profile.save")}
          </button>
        </form>

        <form className="settings-card" onSubmit={saveSecurity}>
          <div className="settings-card-header">
            <span className="settings-card-icon">
              <KeyRound size={20} />
            </span>
            <div>
              <h3>{t("dashboard.settings.security.title")}</h3>
              <p>{t("dashboard.settings.security.description")}</p>
            </div>
          </div>

          <div className="settings-form-grid single">
            <label>
              {t("dashboard.settings.security.currentPassword")}
              <input
                type="password"
                name="currentPassword"
                value={securityForm.currentPassword}
                onChange={handleSecurityChange}
              />
            </label>

            <label>
              {t("dashboard.settings.security.newPassword")}
              <input
                type="password"
                name="newPassword"
                value={securityForm.newPassword}
                onChange={handleSecurityChange}
              />
            </label>

            <label>
              {t("dashboard.settings.security.confirmPassword")}
              <input
                type="password"
                name="confirmPassword"
                value={securityForm.confirmPassword}
                onChange={handleSecurityChange}
              />
            </label>
          </div>

          <button
            className="settings-secondary-btn"
            type="submit"
            disabled={saving === "security"}
          >
            <KeyRound size={18} />
            {saving === "security"
              ? t("dashboard.common.saving")
              : t("dashboard.settings.security.change")}
          </button>
        </form>

        <section className="settings-card wide">
          <div className="settings-card-header">
            <span className="settings-card-icon">
              <MonitorCog size={20} />
            </span>
            <div>
              <h3>{t("dashboard.settings.preferences.title")}</h3>
              <p>{t("dashboard.settings.preferences.description")}</p>
            </div>
          </div>

          <div className="settings-preferences">
            <label className="settings-toggle">
              <input
                type="checkbox"
                name="emailNotifications"
                checked={preferences.emailNotifications}
                onChange={handlePreferenceChange}
              />
              <span></span>
              <div>
                <strong>
                  {t("dashboard.settings.preferences.emailNotifications")}
                </strong>
                <small>
                  {t("dashboard.settings.preferences.emailNotificationsDesc")}
                </small>
              </div>
            </label>

            <label className="settings-toggle">
              <input
                type="checkbox"
                name="reservationAlerts"
                checked={preferences.reservationAlerts}
                onChange={handlePreferenceChange}
              />
              <span></span>
              <div>
                <strong>
                  {t("dashboard.settings.preferences.reservationAlerts")}
                </strong>
                <small>
                  {t("dashboard.settings.preferences.reservationAlertsDesc")}
                </small>
              </div>
            </label>

            <label className="settings-toggle">
              <input
                type="checkbox"
                name="weeklyReports"
                checked={preferences.weeklyReports}
                onChange={handlePreferenceChange}
              />
              <span></span>
              <div>
                <strong>
                  {t("dashboard.settings.preferences.weeklyReports")}
                </strong>
                <small>
                  {t("dashboard.settings.preferences.weeklyReportsDesc")}
                </small>
              </div>
            </label>
          </div>

          <div className="settings-select-row">
            <label>
              <span>
                <Globe2 size={16} /> {t("dashboard.common.language")}
              </span>
              <select
                name="language"
                value={preferences.language}
                onChange={handlePreferenceChange}
              >
                <option value="English">
                  {t("dashboard.languages.english")}
                </option>
                <option value="French">
                  {t("dashboard.languages.french")}
                </option>
                <option value="Arabic">
                  {t("dashboard.languages.arabic")}
                </option>
              </select>
            </label>

            <label>
              {t("dashboard.settings.preferences.timezone")}
              <select
                name="timezone"
                value={preferences.timezone}
                onChange={handlePreferenceChange}
              >
                <option value="Africa/Morrocco">Africa/Morrocco</option>
                <option value="Europe/Paris">Europe/Paris</option>
                <option value="UTC">UTC</option>
              </select>
            </label>
          </div>

          <button
            className="settings-primary-btn"
            type="button"
            onClick={savePreferences}
            disabled={saving === "preferences"}
          >
            <Save size={18} />
            {saving === "preferences"
              ? t("dashboard.common.saving")
              : t("dashboard.settings.preferences.save")}
          </button>
        </section>
      </div>
    </div>
  );
};

export default Settings;
