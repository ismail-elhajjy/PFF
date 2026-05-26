import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { ShieldCheck, Users } from "lucide-react";
import "./AdminUsers.css";

const AdminUsers = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const totalUsers = meta.stats?.total_users ?? meta.total ?? users.length;
  const adminCount =
    meta.stats?.admin_count ??
    users.filter((user) => user.role === "admin").length;

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8000/api/admin/users?page=${page}&search=${search}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      console.log("Data received:", response.data);
      if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else if (response.data && response.data.data) {
        setUsers(response.data.data);
        setMeta(response.data);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const handleDelete = (id) => {
    Swal.fire({
      title: t("dashboard.common.areYouSure"),
      text: t("dashboard.users.deleteWarning"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: t("dashboard.common.deleteConfirm"),
      cancelButtonText: t("dashboard.common.cancel"),
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          await axios.delete(`http://localhost:8000/api/admin/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          Swal.fire(
            t("dashboard.common.deleted"),
            t("dashboard.users.deleted"),
            "success",
          );
          fetchUsers();
        } catch (error) {
          console.error("Delete error:", error);
          Swal.fire(
            t("dashboard.common.error"),
            t("dashboard.common.somethingWrong"),
            "error",
          );
        }
      }
    });
  };

  const handleEditRole = async (user) => {
    const result = await Swal.fire({
      title: t("dashboard.users.editRoleTitle"),
      text: t("dashboard.users.editRoleText", { name: user.name }),
      input: "select",
      inputOptions: {
        client: t("dashboard.roles.client"),
        admin: t("dashboard.roles.admin"),
      },
      inputValue: user.role || "client",
      showCancelButton: true,
      confirmButtonText: t("dashboard.users.updateRole"),
      cancelButtonText: t("dashboard.common.cancel"),
      confirmButtonColor: "#2563eb",
      inputValidator: (value) => {
        if (!value) {
          return t("dashboard.users.chooseRole");
        }
        return null;
      },
    });

    if (!result.isConfirmed || result.value === user.role) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `http://localhost:8000/api/admin/users/${user.id}/role`,
        { role: result.value },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const updatedUser = response.data.user || { ...user, role: result.value };
      setUsers((prevUsers) =>
        prevUsers.map((item) => (item.id === user.id ? updatedUser : item)),
      );
      setMeta((prevMeta) => {
        const wasAdmin = user.role === "admin";
        const isAdmin = result.value === "admin";
        if (wasAdmin === isAdmin || !prevMeta.stats) return prevMeta;

        return {
          ...prevMeta,
          stats: {
            ...prevMeta.stats,
            admin_count: prevMeta.stats.admin_count + (isAdmin ? 1 : -1),
          },
        };
      });
      Swal.fire(
        t("dashboard.common.updated"),
        t("dashboard.users.roleUpdated"),
        "success",
      );
    } catch (error) {
      console.error("Role update error:", error);
      Swal.fire(
        t("dashboard.common.error"),
        error.response?.data?.message || t("dashboard.common.somethingWrong"),
        "error",
      );
    }
  };

  return (
    <div className="users-container">
      <div className="users-header">
        <h2>{t("dashboard.users.title")}</h2>
        <div className="search-box">
          <input
            type="text"
            placeholder={t("dashboard.users.search")}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="users-stats-grid">
        <div className="users-stat-card total-users">
          <div>
            <p>{t("dashboard.users.totalUsers")}</p>
            <h3>{totalUsers}</h3>
          </div>
          <span className="stat-icon">
            <Users size={24} />
          </span>
        </div>

        <div className="users-stat-card admin-users">
          <div>
            <p>{t("dashboard.users.admins")}</p>
            <h3>{adminCount}</h3>
          </div>
          <span className="stat-icon">
            <ShieldCheck size={24} />
          </span>
        </div>
      </div>

      <div className="table-responsive">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>{t("dashboard.users.table.user")}</th>
              <th>{t("dashboard.users.table.email")}</th>
              <th>{t("dashboard.users.table.role")}</th>
              <th>{t("dashboard.users.table.actions")}</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center">
                  <div className="loader-wrapper">
                    <div className="custom-spinner"></div>
                  </div>
                </td>
              </tr>
            ) : (
              (users || []).map((user) => (
                <tr key={user.id}>
                  <td data-label="ID">#{user.id}</td>

                  <td
                    data-label={t("dashboard.users.table.user")}
                    className="user-name"
                  >
                    {user.name}
                  </td>

                  <td data-label={t("dashboard.users.table.email")}>
                    {user.email}
                  </td>

                  <td data-label={t("dashboard.users.table.role")}>
                    <span className={`badge ${user.role}`}>
                      {t(`dashboard.roles.${user.role}`, {
                        defaultValue: user.role,
                      })}
                    </span>
                  </td>

                  <td data-label={t("dashboard.users.table.actions")}>
                    <div className="user-actions">
                      <button
                        className="btn-edit"
                        onClick={() => handleEditRole(user)}
                      >
                        {t("dashboard.users.editRole")}
                      </button>

                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(user.id)}
                      >
                        {t("dashboard.common.delete")}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination-wrapper">
        <button
          className="p-btn prev-btn"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          <span aria-hidden="true">&larr;</span>{" "}
          {t("dashboard.common.previous")}
        </button>

        <div className="page-info">
          {t("dashboard.common.page")} <strong>{meta.current_page || 1}</strong>{" "}
          {t("dashboard.common.of")} <strong>{meta.last_page || 1}</strong>
        </div>

        <button
          className="p-btn next-btn"
          disabled={page === meta.last_page || !meta.last_page}
          onClick={() => setPage(page + 1)}
        >
          {t("dashboard.common.next")} <span aria-hidden="true">&rarr;</span>
        </button>
      </div>
    </div>
  );
};

export default AdminUsers;
