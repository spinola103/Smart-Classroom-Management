import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import "./admin-dashboard.css";

const AdminDashboard = () => {
  const [adminId, setAdminId] = useState(null);

  // Fetch admin ID on component mount
  useEffect(() => {
    const storedAdminId =
      sessionStorage.getItem("adminId") || localStorage.getItem("adminId");
    if (storedAdminId) {
      setAdminId(storedAdminId);
    } 
  }, []);

  return (
    <div className="dashboard-container">
      {/* Welcome Section */}
      <div className="welcome-section">
        <h1>Welcome, {adminId || "Admin"}! 🛠️</h1>
      </div>

      {/* Main Content Section */}
      <div className="main-content">
        <h2>Admin Dashboard</h2>
        <div className="cards">
          {/* Resource Allocation Card */}
          <Link to="/resource-allocation" className="card">
            <h3>Resource Allocation</h3>
            <p>Allocate resources to different classes efficiently.</p>
          </Link>

          {/* Support Chat Card */}
          <Link to="/admin-support" className="card">
            <h3>Support Chat</h3>
            <p>Chat with teachers or students for assistance.</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
