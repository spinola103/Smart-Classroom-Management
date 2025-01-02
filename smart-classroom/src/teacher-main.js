import React from "react";
import { useNavigate } from "react-router-dom";
import "./teacher-main.css";

// DashboardCards Component
const DashboardCards = () => {
  const navigate = useNavigate();

  const cardsData = [
    {
      href: "http://localhost:3000/",
      imgSrc: require("./images/icon-attendance.png"),
      title: "Attendance Overview 📊",
      description: "View attendance reports and summaries.",
      external: true, // External link
    },
    {
      href: "/teacher-dashboard",
      imgSrc: require("./images/courses.png"),
      title: "Courses 📚",
      description: "Manage and explore available courses.",
      external: false, // Internal navigation
    },
    {
      href: "http://127.0.0.1:5000/",
      imgSrc: require("./images/icon-analysis.png"),
      title: "Mood Analysis 🌡",
      description: "Analyze student moods and behaviors.",
      external: true, // External link
    },
    {
      href: "/Support",
      imgSrc: require("./images/support.png"),
      title: "Support 💬",
      description: "Provide support and resolve queries.",
      external: false, // Internal navigation
    },
  ];

  return (
    <div className="dashboard-container">
      <section className="cards-section">
        <div className="cards">
          {cardsData.map((card, index) => (
            card.external ? (
              // Render external links
              <a
                key={index}
                href={card.href}
                className="card"
                target="_blank" // Open in a new tab
                rel="noopener noreferrer" // Security enhancement
              >
                <img src={card.imgSrc} alt={card.title} />
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </a>
            ) : (
              // Render internal links
              <div
                key={index}
                className="card"
                onClick={() => navigate(card.href)}
              >
                <img src={card.imgSrc} alt={card.title} />
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
            )
          ))}
        </div>
      </section>
    </div>
  );
};

export default DashboardCards;
