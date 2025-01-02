import React, { useState, useEffect } from "react";
import "./Support.css";

const Support = () => {
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
      sender: "Teacher",
      text: message,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    localStorage.setItem("supportMessages", JSON.stringify(updatedMessages));
    setMessage(""); // Clear the input field
  };

  return (
    <div className="support-container">
      <h2>Teacher Support Chat</h2>
      <div className="support-message-box">
        {messages.map((msg, index) => (
          <div key={index} className="support-message">
            <strong>{msg.sender}:</strong>
            <span>{msg.text}</span>
            <small>{new Date(msg.timestamp).toLocaleString()}</small>
          </div>
        ))}
      </div>
      <div className="support-input-container">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Support;
