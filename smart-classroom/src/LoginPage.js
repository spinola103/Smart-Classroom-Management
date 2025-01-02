import React, { useState } from 'react';
import { ref, get } from "firebase/database";
import { db } from './Firebase';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Login.css';


// Fetch user data from Firebase
const fetchUserData = async (uniqueId) => {
  try {
    console.log('Fetching data for unique ID:', uniqueId);
    const userRef = ref(db, `users/${uniqueId}`);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      const user = snapshot.val();
      console.log('User found:', user);
      return user;
    } else {
      console.log('No user with this unique ID:', uniqueId);
      return null;
    }
  } catch (error) {
    console.error('Error fetching user data:', error.message);
    return null;
  }
};

const LoginPage = () => {
  const [uniqueId, setUniqueId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogin = async () => {
    try {
      setError(null); // Reset error message

      console.log('Attempting to log in with Unique ID:', uniqueId);

      // Fetch user data based on unique ID
      const userData = await fetchUserData(uniqueId);

      if (!userData) {
        setError('User not found. Please check your Unique ID.');
        return;
      }

      console.log('User data retrieved:', userData);

      // Check if the password matches
      if (userData.password !== password) {
        setError('Incorrect password. Please try again.');
        return;
      }

      console.log('User logged in:', userData);

      // Store uniqueId and role in sessionStorage
      sessionStorage.setItem('uniqueId', uniqueId);
      sessionStorage.setItem('role', userData.role);

      // Redirect to the respective dashboard based on role
      switch (userData.role) {
        case 'student':
          navigate('/student-dashboard');
          break;
        case 'teacher':
          navigate('/teacher-main');
          break;
        case 'admin':
          navigate('/admin-dashboard');
          break;
        default:
          console.error('Unknown role');
      }
    } catch (error) {
      console.error('Login error:', error.message);
      setError('Login failed. Please check your Unique ID and password.');
    }
  };

  return (
    <section className="login-section">
      <div className="login-box">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="textbox">
          <i className="fas fa-user"></i>
          <input
            type="text"
            placeholder="Unique ID"
            value={uniqueId}
            onChange={(e) => setUniqueId(e.target.value)}
          />
        </div>
        <div className="textbox">
          <i className="fas fa-lock"></i>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="btn" onClick={handleLogin}>Login</button>
        <a href="/forgot-password" className="forgot-password">Forgot Password?</a>
      </div>
    </section>
  );
};

export default LoginPage;
