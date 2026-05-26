import React from 'react';
import Sidebar from './SideBar';
import { Outlet } from 'react-router-dom'; 
import './DashboardLayout.css';  

const DashboardLayout = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="dashboard-main-content">
        <div className="dashboard-wrapper">
           <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;