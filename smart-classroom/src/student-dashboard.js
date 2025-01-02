import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import "./student-dashboard.css";

const StudentDashboard = () => {
  const [studentId, setStudentId] = useState(null);

  // Fetch student ID on component mount
  useEffect(() => {
    const storedStudentId =
      sessionStorage.getItem("uniqueId") || localStorage.getItem("uniqueId");
    if (storedStudentId) {
      setStudentId(storedStudentId);
    } else {
      alert("Student not logged in. Redirecting to login...");
      window.location.href = "/login";
    }
  }, []);

  return (
    <div className="dashboard-container">
      {/* Welcome Section */}
      <div className="welcome-section">
        <h1>Welcome, {studentId || "Student"}! 🎓</h1>
      </div>

      {/* Main Content Section */}
      <div className="main-content">
        <h2>Explore Your Dashboard</h2>
        <div className="cards">
          {/* Card 1 */}
          <Link to="/Leaderboard" className="card">
            <img src={require("./images/leaderboard.png")} alt="Leaderboard" />
            <h3>Leaderboard</h3>
            <p>Track your performance and compete.</p>
          </Link>

          {/* Card 2 */}
          <Link to="/courses" className="card">
            <img src={require("./images/courses.png")} alt="Courses" />
            <h3>Courses</h3>
            <p>Explore and enroll in available courses.</p>
          </Link>

          {/* Card 4 */}
          <Link to="http://localhost:3001/" className="card">
            <img src={require("./images/support.png")} alt="Support" />
            <h3>Chatbot</h3>
            <p>Reach out for any assistance you need.</p>
          </Link>
        </div>
      </div>    
    </div>
  );
};

export default StudentDashboard;
