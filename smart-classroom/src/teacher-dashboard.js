import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './teacher-dashboard.css';

const TeacherDashboard = () => {
  const [teacherId, setTeacherId] = useState(null);
  const [courses, setCourses] = useState([]);

  // Fetch teacher ID on component mount
  useEffect(() => {
    const storedTeacherId =
      sessionStorage.getItem('uniqueId') || localStorage.getItem('uniqueId');
    if (storedTeacherId) {
      setTeacherId(storedTeacherId);
    } else {
      alert('Teacher not logged in. Redirecting to login...');
      window.location.href = '/login';
    }
  }, []);

  // Fetch teacher's courses when teacherId is available
  useEffect(() => {
    if (teacherId) {
      axios
        .get(`http://localhost:5000/api/teachers/${teacherId}/courses`)
        .then((response) => {
          setCourses(response.data.courses || []);
        })
        .catch((error) => {
          console.error('Error fetching courses:', error);
        });
    }
  }, [teacherId]);

  // Handle button click to navigate to lessons page
  const handleCourseClick = (courseId) => {
    window.location.href = `/Lessons/${courseId}`;
  };

  return (
    <div className="teacher-dashboard">
      <header className="dashboard-header">
        <h1>Welcome, {teacherId || 'Teacher'}!</h1>
        <p>Here are your assigned courses:</p>
      </header>

      <main className="dashboard-main">
        <section className="courses-section">
          {courses.length > 0 ? (
            <ul className="course-list">
              {courses.map((course) => (
                <li
                  key={course._id}
                  className="course-item"
                  onClick={() => handleCourseClick(course._id)}
                >
                  <h3 className="course-title">{course.title}</h3>
                  <p>
                    <strong>Code:</strong> {course.code}
                  </p>
                  <p>
                    <strong>Term:</strong> {course.term}
                  </p>
                  {course.description && (
                    <p>
                      <strong>Description:</strong> {course.description}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-courses">No courses assigned yet.</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default TeacherDashboard;
