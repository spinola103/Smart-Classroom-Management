import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Features from "./Features";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Footer from "./Footer";
import LoginPage from "./LoginPage";
import StudentDashboard from "./student-dashboard"; // Student Dashboard
import Courses from "./Courses"; // Courses List
import CourseDetails from "./CourseDetails"; // Course Details
import TeacherDashboard from "./teacher-dashboard"; // Teacher Dashboard
import Lessons from "./Lessons"; // Lessons Page
import LessonDetails from "./LessonDetails"; // Lesson Details Page
import Leaderboard from "./Leaderboard"; // Leaderboard Component
import DashboardCards from "./teacher-main";
import AttendancePage from "./AttendancePage";
import Support from "./Support";
import AdminDashboard from "./admin-dashboard";
import ResourceAllocation from "./ResourceAllocation";
import AdminSupport from "./AdminSupport";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Route: Home Page */}
          <Route
            path="/"
            element={
              <MainLayout>
                <Hero />
                <Features />
              </MainLayout>
            }
          />

          {/* Public Route: Login Page */}
          <Route
            path="/login"
            element={
              <SimpleLayout>
                <LoginPage />
              </SimpleLayout>
            }
          />

          {/* Private Route: Student Dashboard */}
          <Route
            path="/student-dashboard"
            element={
              <MainLayout>
                <StudentDashboard />
              </MainLayout>
            }
          />

          {/* Private Route: Courses List */}
          <Route
            path="/courses"
            element={
              <MainLayout>
                <Courses />
              </MainLayout>
            }
          />

          {/* Private Route: Course Details */}
          <Route
            path="/course/:courseId"
            element={
              <MainLayout>
                <CourseDetails />
              </MainLayout>
            }
          />

          {/* Private Route: Teacher Dashboard */}
          <Route
            path="/teacher-main"
            element={
              <MainLayout>
                <DashboardCards/>
              </MainLayout>
            }
          />

            <Route
            path="/teacher-dashboard"
            element={
              <MainLayout>
                <TeacherDashboard />
              </MainLayout>
            }
          />

          {/* Private Route: Lessons Page */}
          <Route
            path="/lessons/:id"
            element={
              <MainLayout>
                <Lessons />
              </MainLayout>
            }
          />

          {/* Private Route: Lesson Details Page */}
          <Route
            path="/lessondetails/:lessonId"
            element={
              <MainLayout>
                <LessonDetails />
              </MainLayout>
            }
          />

          {/* Private Route: Leaderboard Page */}
          <Route
            path="/leaderboard"
            element={
              <MainLayout>
                <Leaderboard />
              </MainLayout>
            } 
          />


          {/* Private Route: Attendance Page */}
          <Route
            path="/AttendancePage"
            element={
              <MainLayout>
                <AttendancePage />
              </MainLayout>
            } 
          />

          {/* Catch-All Route: 404 Not Found */}
          <Route
            path="*"
            element={
              <SimpleLayout>
                <div style={{ textAlign: "center", padding: "2rem" }}>
                  <h1>404 - Page Not Found</h1>
                  <p>Sorry, the page you are looking for does not exist.</p>
                </div>
              </SimpleLayout>
            }
          />

          {/* Private Route: Support (Teacher Chat) */}
          <Route
            path="/support"
            element={
              <MainLayout>
                <Support />
              </MainLayout>
            }
          />

           <Route
            path="/admin-dashboard"
            element={
              <MainLayout>
                <AdminDashboard />
              </MainLayout>
            }
          />  

         <Route
            path="/resource-allocation"
            element={
              <MainLayout>
                <ResourceAllocation />
              </MainLayout>
            }
          />  

          <Route
            path="/admin-support"
            element={
              <MainLayout>
                <AdminSupport />
              </MainLayout>
            }
          /> 

        </Routes>
      </div>
    </Router>
  );
}

// Main layout for pages with Navbar and Footer
const MainLayout = ({ children }) => (
  <>
    <Navbar />
    <main>{children}</main>
    <Footer />
  </>
);

// Simple layout for standalone pages (like login or 404)
const SimpleLayout = ({ children }) => (
  <div style={{ margin: "0 auto", padding: "2rem", maxWidth: "600px" }}>
    {children}
  </div>
);

export default App;
