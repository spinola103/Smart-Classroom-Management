import React, { useState } from 'react';
import './AttendancePage.css';
import axios from 'axios';

const AttendancePage = () => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [attendanceData, setAttendanceData] = useState([]);
  const [showAttendance, setShowAttendance] = useState(false);

  // Fetch attendance data for a specific class and month
  const fetchAttendance = async (className, monthName) => {
    try {
      const response = await axios.post('http://localhost:5000/attendance', {
        className,
        monthName,
        type: 'Daily', // Default to daily
      });
      setAttendanceData(response.data);
      setShowAttendance(true);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      setAttendanceData([]); // Clear data if fetch fails
      setShowAttendance(false);
    }
  };

  // Handle class selection
  const handleClassClick = (className) => {
    setSelectedClass(className);
    setSelectedMonth(''); // Reset the selected month
    setAttendanceData([]); // Clear previous data
    setShowAttendance(false); // Hide attendance table initially
  };

  // Handle month change
  const handleMonthChange = (e) => {
    const monthName = e.target.value;
    setSelectedMonth(monthName);

    if (selectedClass && monthName) {
      fetchAttendance(selectedClass, monthName);
    }
  };

  // Render attendance table for daily attendance
  const renderDailyAttendance = () => {
    if (!attendanceData || attendanceData.length === 0) {
      return <p>No daily attendance data available for {selectedMonth}.</p>;
    }

    const days = Array.from('{ length: 30 }, (_, i) => Day ${i + 1}');

    return (
      <table className="attendance-table">
        <thead>
          <tr>
            <th>Name</th>
            {days.map((day, index) => (
              <th key={index}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {attendanceData.map((student) => (
            <tr key={student._id}>
              <td>{student.Name}</td>
              {days.map((day, index) => {
                const status = student.Attendance[day] || 'N/A';
                return (
                  <td key={index} className={status === 'P' ? 'present' : 'absent'}>
                    {status}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="attendance-page">
      <h2>Class Attendance</h2>

      {/* Class Buttons */}
      <div className="class-buttons">
        {['A', 'B', 'C'].map((className) => (
          <button
            key={className}
            className="class-button"
            onClick={() => handleClassClick(className)}
          >
            Class {className}
          </button>
        ))}
      </div>

      {/* Show Attendance details */}
      {selectedClass && (
        <div className="attendance-details">
          <h3>Attendance for Class {selectedClass}</h3>

          {/* Month Selection */}
          <label htmlFor="month-select">Select Month:</label>
          <select
            id="month-select"
            value={selectedMonth}
            onChange={handleMonthChange}
          >
            <option value="" disabled>
              Choose Month
            </option>
            {[
              'January',
              'February',
              'March',
              'April',
              'May',
              'June',
              'July',
              'August',
              'September',
              'October',
              'November',
              'December',
            ].map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>

          {/* Attendance Table */}
          {showAttendance && (
            <div className="attendance-table-container">
              <h4>Daily Attendance Table for {selectedMonth}</h4>
              {renderDailyAttendance()}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AttendancePage;