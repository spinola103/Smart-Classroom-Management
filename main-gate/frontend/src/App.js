import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/logs');
                setLogs(response.data);
            } catch (error) {
                console.error('Error fetching logs:', error);
            }
        };

        fetchLogs();
        const interval = setInterval(fetchLogs, 5000); // Poll every 5 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <h1>Main Gate Admin Dashboard</h1>
            </header>
            <div className="notifications">
                <h2>Alerts</h2>
                <div className="alert-container">
                    {logs.slice(-5).map((log, index) => (
                        <div key={index} className={`alert ${log.status === "Unauthorized" ? "unauthorized" : "authorized"}`}>
                            <strong>{log.status === "Unauthorized" ? "⚠️ Alert: Unauthorized Entry" : "✅ Authorized"}</strong>
                            <p>Name: {log.name}</p>
                            <p>Time: {log.timestamp}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default App;
