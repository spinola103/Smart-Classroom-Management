const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const app = express();

app.use(cors());
app.use(bodyParser.json());

const LOG_FILE = 'unauthorized_log.json';

// Ensure log file exists
if (!fs.existsSync(LOG_FILE)) {
    fs.writeFileSync(LOG_FILE, JSON.stringify([]));
}

// Endpoint to log alerts
app.post('/api/alert', (req, res) => {
    const { name, status, timestamp } = req.body;
    const newLog = { name, status, timestamp };

    const logs = JSON.parse(fs.readFileSync(LOG_FILE));
    logs.push(newLog);
    fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));

    res.status(200).json({ message: 'Alert logged successfully!' });
});

// Endpoint to fetch logs
app.get('/api/logs', (req, res) => {
    const logs = JSON.parse(fs.readFileSync(LOG_FILE));
    res.status(200).json(logs);
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
