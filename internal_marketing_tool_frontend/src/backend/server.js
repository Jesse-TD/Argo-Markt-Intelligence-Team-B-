const express = require('express');
const cors = require('cors');
const { runNewVsTrueUserReport } = require('./QueryManager');

// GA4 Analytics Handlers
const {
  runMainDashboard,
  runAcquisitionBatch,
  runEngagementBatch,
  runRiskBatch,
  runSalesBatch,
  createBatchQueries,
  analyticsDataClient, // ✅ new
  PROPERTY_ID           // ✅ new
} = require('./ApiHandler');


const app = express();

// Enable CORS for all routes
app.use(cors());

// Set the port (either from environment variable or default to 5000)
const port = 5000;

// API route that your frontend will call to fetch the GA4 report data
app.get('/api/report', async (req, res) => {
  try {
    const reportData = await runNewVsTrueUserReport();
    res.json(reportData);
  } catch (error) {
    console.error('Error fetching GA4 report data:', error);
    res.status(500).json({ message: 'Failed to fetch data from GA4 API' });
  }
});

// ✅ Route: Fetch Main Dashboard Data
app.get("/api/main-dashboard", async (req, res) => {
  const { start = "7daysAgo", end = "yesterday" } = req.query;

  try {
    const data = await runMainDashboard(start, end);
    res.json(data);
  } catch (error) {
    console.error("Error fetching main dashboard data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Route: Fetch Acquisition Data
app.get("/api/acquisition", async (req, res) => {
  try {
    const data = await runAcquisitionBatch();
    res.json(data);
  } catch (error) {
    console.error("Error fetching acquisition data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Route: Fetch Engagement Data
app.get("/api/engagement", async (req, res) => {
  try {
    const data = await runEngagementBatch();
    res.json(data);
  } catch (error) {
    console.error("Error fetching engagement data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Route: Dynamic page + video pairing report
app.get("/api/dynamic-report", async (req, res) => {
  const { pageTitle, videoTitle, start, end } = req.query;

  if (!pageTitle || !videoTitle) {
    return res.status(400).json({ error: "Missing required query params: pageTitle or videoTitle" });
  }

  try {
    console.log(`🎯 Received query for Page: "${pageTitle}" and Video: "${videoTitle}"`);
    const queryBatch = createBatchQueries(pageTitle, videoTitle, start, end);

    const [response] = await analyticsDataClient.batchRunReports({
      property: `properties/${PROPERTY_ID}`,
      requests: Object.values(queryBatch),
    });

    if (!response.reports || response.reports.length === 0) {
      console.warn(`⚠️ No reports returned for Page: "${pageTitle}", Video: "${videoTitle}"`);
      return res.json([]);
    }

    const results = response.reports.map((report, index) => ({
      reportId: index + 1,
      dimensions: report.dimensionHeaders.map(header => header.name),
      metrics: report.metricHeaders.map(header => header.name),
      rows: report.rows.map(row => ({
        dimensions: row.dimensionValues.map(dv => dv.value),
        metrics: row.metricValues.map(mv => mv.value),
      }))
    }));

    res.json(results);
  } catch (error) {
    console.error("❌ Server Error for Page:", pageTitle, "Video:", videoTitle);
    console.error("🔥 Full error details:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});