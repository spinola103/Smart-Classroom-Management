import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Leaderboard.css";

const Leaderboard = () => {
  const [studentId, setStudentId] = useState(null);
  const [topStudents, setTopStudents] = useState([]);
  const [rankDetails, setRankDetails] = useState(null);
  const [error, setError] = useState("");

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

  // Fetch leaderboard and rank details when studentId is available
  useEffect(() => {
    if (studentId) {
      // Fetch top 5 students
      const fetchLeaderboard = async () => {
        try {
          const response = await axios.get("http://localhost:5000/api/leaderboard");
          setTopStudents(response.data);
        } catch (err) {
          setError("Could not fetch leaderboard data.");
        }
      };

      // Fetch logged-in student's rank
      const fetchRank = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/rank/${studentId}`
          );
          setRankDetails(response.data);
        } catch (err) {
          setError("Could not fetch rank data.");
        }
      };

      fetchLeaderboard();
      fetchRank();
    }
  }, [studentId]);

  return (
    <div className="leaderboard-container">
      {error && <p className="error-message">{error}</p>}

      <h2 className="leaderboard-title">Leaderboard</h2>
      <ul className="leaderboard-list">
        {topStudents.map((student, index) => (
          <li
            key={student.unique_id}
            className={`leaderboard-item rank-${index + 1}`}
          >
            <span className="rank">
              {index === 0
                ? "🏆"
                : index === 1
                ? "🥈"
                : index === 2
                ? "🥉"
                : `#${index + 1}`}
            </span>
            <span className="name">{student.name}</span>
            <span className="points">{student.points} pts</span>
          </li>
        ))}
      </ul>

      {rankDetails && (
        <div className="rank-details">
          <h3>Your Rank 🌟</h3>
          <p>
            Rank: #{rankDetails.rank} <br />
            Name: {rankDetails.student.name} <br />
            Points: {rankDetails.student.points} 🎯
          </p>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;

