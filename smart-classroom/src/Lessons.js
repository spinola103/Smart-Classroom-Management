import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./Lessons.css";

function Lessons() {
  const { id: courseId } = useParams(); // Extract course ID from the URL
  const [name, setName] = useState(""); // Lesson name
  const [audio, setAudio] = useState(null); // Audio file
  const [lessons, setLessons] = useState([]); // List of lessons
  const [loading, setLoading] = useState(false); // Loading state for transcription

  // Fetch lessons for the selected course
  useEffect(() => {
    if (courseId) {
      axios
        .get(`http://localhost:5000/api/courses/${courseId}/lessons`)
        .then((response) => setLessons(response.data))
        .catch((error) => console.error("Error fetching lessons:", error));
    }
  }, [courseId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!audio) {
      alert("Please upload an audio file.");
      return;
    }

    setLoading(true); // Start loading state
    const formData = new FormData();
    formData.append("course", courseId); // Use the course ID from the URL
    formData.append("name", name);
    formData.append("audio", audio);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/lessons",
        formData
      );
      alert("Lesson added successfully!");
      setLessons([...lessons, response.data]); // Add the new lesson to the list
      setName("");
      setAudio(null);
    } catch (error) {
      console.error("Error adding lesson:", error.message);
      alert("Failed to add the lesson. Please try again.");
    } finally {
      setLoading(false); // End loading state
    }
  };

  return (
    <div className="lessons-container">
      <h1>Lessons Dashboard</h1>

      {/* Form for adding a new lesson */}
      <form onSubmit={handleSubmit} className="lesson-form">
        <label>
          Lesson Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Upload Audio:
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setAudio(e.target.files[0])}
            required
          />
        </label>
        <br />
        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Add Lesson"}
        </button>
      </form>

      {/* Loading message while transcription is in progress */}
      {loading && <p>Transcription is in progress, please wait...</p>}

      {/* Display lessons */}
      <h2>Lessons</h2>
      {lessons.length > 0 ? (
        <div className="lesson-cards-container">
          {lessons.map((lesson) => (
            <div key={lesson._id} className="lesson-card">
              <h3>{lesson.name}</h3>
              <p>{lesson.transcription || "Transcription pending..."}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No lessons available for the selected course.</p>
      )}
    </div>
  );
}

export default Lessons;
