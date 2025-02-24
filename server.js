const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Function to get visitor IP correctly
const getIp = (req) => {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (ip.includes(',')) ip = ip.split(',')[0]; // Handles multiple IPs (proxies)
    return ip.replace('::ffff:', ''); // Removes IPv6 formatting
};

// Function to get formatted time in IST (or any timezone)
const getFormattedTime = () => {
    return new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }); // Change time zone if needed
};

// Route to capture and log IP
app.get('/', (req, res) => {
    const visitorIp = getIp(req);
    const logEntry = `${getFormattedTime()} - ${visitorIp}\n`;

    // Save IP and timestamp to a file
    fs.appendFile('ip_logs.txt', logEntry, (err) => {
        if (err) console.error('Error saving IP:', err);
    });

    res.send(`Your IP is: ${visitorIp}`);
});

// Route to view logs
app.get('/logs', (req, res) => {
    fs.readFile('ip_logs.txt', 'utf8', (err, data) => {
        if (err) return res.status(500).send("Error reading logs.");
        res.send(`<pre>${data}</pre>`);
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
