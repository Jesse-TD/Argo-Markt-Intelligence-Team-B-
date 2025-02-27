const express = require('express');
const cors = require('cors');  // Import cors
const { runNewVsTrueUserReport } = require('./QueryManager');
const app = express();

// Enable CORS for all routes
app.use(cors());

// Set the port (either from environment variable or default to 5000)
const port = 5000;

// API route that your frontend will call to fetch the GA4 report data
app.get('/api/report', async (req, res) => {
  try {
    const reportData = await runNewVsTrueUserReport();
    res.json(reportData);  // Send the data back to frontend
  } catch (error) {
    console.error('Error fetching GA4 report data:', error);
    res.status(500).json({ message: 'Failed to fetch data from GA4 API' });
  }
});

// Start the server on the specified port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

