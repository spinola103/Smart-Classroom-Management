# 🎓 Edvance — Smart Classroom Management System

> **Smart India Hackathon 2024 Finalist**

An AI-powered classroom monitoring and management platform built to modernize education through facial recognition, NLP, IoT automation, and real-time analytics — all served through a unified Flask web dashboard.

---

## 🚀 Features

- **Facial Recognition Attendance** — Automated student attendance using OpenCV-based face detection and recognition, eliminating manual roll calls.
- **NLP Chatbot** — An integrated conversational assistant to handle student queries, FAQs, and classroom information using Natural Language Processing.
- **IoT Classroom Automation** — Smart control of classroom devices (lights, fans, AC) based on occupancy detection and schedules.
- **Smoke / Safety Detection** — Real-time hazard monitoring using sensor integration (`smoke_detector.py`).
- **Analytics Dashboard** — Visual insights on attendance trends, classroom utilization, and student engagement metrics.
- **Main Gate Access Control** — Entry/exit management module for campus security.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python, Flask |
| Computer Vision | OpenCV |
| NLP | Natural Language Processing libraries |
| IoT | Sensor integration / Hardware automation |
| Frontend | JavaScript, CSS, HTML |
| Database | (configured in backend) |

---

## 📁 Project Structure

```
Smart-Classroom-Management/
├── smart-classroom/             # Frontend — UI for the dashboard
├── smart-classroom-backend/     # Flask backend — APIs & core logic
│   ├── attendance/              # Facial recognition attendance module
│   ├── chatbot/                 # NLP chatbot module
│   ├── analytics/               # Reporting & dashboard data
│   └── iot/                     # IoT device control
├── main-gate/                   # Gate access control module
└── smoke_detector.py            # Real-time smoke/hazard detection
```

---

## ⚙️ Getting Started

### Prerequisites

- Python 3.8+
- pip
- A webcam (for facial recognition)
- Node.js (for frontend dev, optional)

### Installation

```bash
# Clone the repository
git clone https://github.com/spinola103/Smart-Classroom-Management.git
cd Smart-Classroom-Management

# Install Python dependencies
pip install -r smart-classroom-backend/requirements.txt

# Run the Flask backend
cd smart-classroom-backend
python app.py
```

Then open `http://localhost:5000` in your browser to access the dashboard.

---

## 🤝 Team & Context

This project was built as part of **Smart India Hackathon 2024**, where the team reached the **finalist stage** competing against hundreds of teams nationwide. The system was designed to solve real administrative and operational challenges faced by educational institutions.

---

## 📄 License

This project is open-source. Feel free to fork, explore, and build upon it.
