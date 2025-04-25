const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for cross-device communication
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// In-memory database (replace with real database in production)
const busLocations = {};

// API endpoint to update bus location
app.post('/api/update-location', (req, res) => {
    const { busNumber, lat, lng } = req.body;
    
    if (!busNumber || !lat || !lng) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    busLocations[busNumber] = {
        lat,
        lng,
        timestamp: Date.now()
    };

    console.log(`Updated location for bus ${busNumber}:`, busLocations[busNumber]);
    res.json({ success: true });
});

// API endpoint to get bus location
app.get('/api/get-location/:busNumber', (req, res) => {
    const { busNumber } = req.params;
    
    if (!busLocations[busNumber]) {
        return res.status(404).json({ error: 'Bus not found' });
    }

    res.json(busLocations[busNumber]);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Driver interface: http://localhost:${port}/driver.html`);
    console.log(`Student interface: http://localhost:${port}/student.html`);
});