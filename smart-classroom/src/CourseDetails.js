import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./CourseDetails.css"; // Link to the CSS file

const CourseDetails = () => {
  const { courseId } = useParams(); // Get courseId from URL
  const [lessons, setLessons] = useState([]); // State to hold lessons
  const [error, setError] = useState(""); // State to handle errors
  const [selectedLesson, setSelectedLesson] = useState(null); // State for selected lesson
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch lessons for the course
    const fetchLessons = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/courses/${courseId}/lessons`);
        setLessons(response.data);
      } catch (err) {
        console.error(err);
        setError("Could not load lessons for this course.");
      }
    };

    fetchLessons();
  }, [courseId]);

  // Handle play game button click
  const handlePlayGame = (lessonId) => {
    navigate(`/LessonDetails/${lessonId}`); // Navigate to LessonDetails/lessonId
  };

  return (
    <div className="course-details">
      {error && <p className="error-message">{error}</p>}

      {/* Display lessons */}
      <div className="lessons">
        <h3 className="lessons-title">Lessons</h3>
        {lessons.length > 0 ? (
          <ul className="lessons-list">
            {lessons.map((lesson) => (
              <li
                key={lesson._id}
                className={`lesson-item ${selectedLesson === lesson._id ? "selected" : ""}`}
                onClick={() => setSelectedLesson(lesson._id)}
              >
                <h4 className="lesson-title">{lesson.name}</h4>
                <p className="lesson-transcription">{lesson.transcription}</p>
                {selectedLesson === lesson._id && (
                  <button
                    className="play-game-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayGame(lesson._id); // Redirect on button click
                    }}
                  >
                    Play Game
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          !error && <p className="loading-message">No lessons found for this course.</p>
        )}
      </div>
    </div>
  );
};

export default CourseDetails;
