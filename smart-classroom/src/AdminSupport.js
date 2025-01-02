import React, { useState, useEffect } from "react";
import "./AdminSupport.css";

const AdminSupport = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Load existing messages from local storage
    const storedMessages = JSON.parse(localStorage.getItem("supportMessages")) || [];
    setMessages(storedMessages);
  }, []);

  const sendMessage = () => {
    if (message.trim() === "") return;

    const newMessage = {
      sender: "Admin",
      text: message,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    localStorage.setItem("supportMessages", JSON.stringify(updatedMessages));
    setMessage(""); // Clear the input field
  };

  return (
    <div className="admin-support-container">
      <h2>Admin Support Chat</h2>
      <div className="admin-support-message-box">
        {messages.map((msg, index) => (
          <div key={index} className={`support-message ${msg.sender === "Admin" ? "admin-message" : "teacher-message"}`}>
            <strong>{msg.sender}:</strong>
            <span>{msg.text}</span>
            <small>{new Date(msg.timestamp).toLocaleString()}</small>
          </div>
        ))}
      </div>
      <div className="admin-support-input-container">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your reply here..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default AdminSupport;
