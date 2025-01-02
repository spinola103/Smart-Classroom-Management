import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Courses.css';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/courses')
      .then((response) => setCourses(response.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="dashboard">
      <h1>Your Courses</h1>
      <div className="course-list">
        {courses.map((course) => (
          <div
            key={course._id}
            className="course-card"
            onClick={() => navigate(`/course/${course._id}`)}
          >
            <div className="course-info">
              <h3>{course.title}</h3>
              <p>Code: {course.code}</p>
              <p>Term: {course.term}</p>
            </div>
            <div className="course-options">⋮</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
