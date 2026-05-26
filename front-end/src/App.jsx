import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Footer from "./Components/Footer.jsx";
import ScrollToTop from "./Components/ScrollToTop.jsx";
import Contact from "./Pages/Contact";
import Register from "./Pages/Register.jsx";
import Login from "./Pages/Login.jsx";
import NavBar from "./Components/Navbar.jsx";
import Home from "./Pages/Home.jsx";
import Billboards from "./Pages/Billboards.jsx";
import Reservation from "./Pages/Reservation.jsx";
import Profile from "./Pages/Profile.jsx";
import ProtectedRoute from "./Components/ProtectedRoute.jsx";
import DashboardLayout from "./Dashboard/DashboardLayout";
import AdminDashboard from "./Dashboard/AdminDashboard";
import AddBillboard from "./Dashboard/AddBillboard";
import AdminReservations from "./Dashboard/AdminReservations";
import AdminUsers from "./Dashboard/AdminUsers.jsx";
import Settings from "./Dashboard/Settings.jsx";


import "./App.css";

const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminPath && <NavBar />}
      {children}
      {!isAdminPath && <Footer />}
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <LayoutWrapper>
        <Routes>
          {/* --------------------- Public Routes ---------------------- */}
          <Route path="/" element={<Home />} />
          <Route path="/billboards" element={<Billboards />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ----------------- Client Protected Routes ----------------- */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />

          <Route path="/reservation/:id" element={
            <ProtectedRoute>
              <Reservation />
            </ProtectedRoute>
          } />

          {/* ------------------ Admin Dashboard Routes ----------------- */}

          <Route element={<ProtectedRoute adminOnly={true} />}>
            <Route path="/admin" element={<DashboardLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="billboards/new" element={<AddBillboard />} />
              <Route path="/admin/reservations" element={<AdminReservations />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/settings" element={<Settings />} />
            </Route>
          </Route>

        </Routes>
      </LayoutWrapper>
    </BrowserRouter>
  );
}

export default App;
