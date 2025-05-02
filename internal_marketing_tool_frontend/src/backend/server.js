const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { runNewVsTrueUserReport } = require('./QueryManager');

// GA4 Analytics Handlers
const {
  runMainDashboard,
  runAcquisitionBatch,
  runEngagementBatch,
  runRiskBatch,
  runSalesBatch,
  createBatchQueries,
  analyticsDataClient,
  PROPERTY_ID
} = require('./ApiHandler');

// GPT LLM Imports
const { ArgoAgents } = require('./agentFlow'); // change this path to your actual backend file if different

const app = express();
const port = 5001;

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000', // frontend URL
  methods: 'GET,POST,PUT,DELETE',
};

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());

// Cache for storing GA4 query results
const queryCache = {
  mainDashboard: { data: null, timestamp: null },
  dynamicReportPairs: {},
  cacheExpiry: 3600000 // 1 hour in milliseconds
};

// Video and page pairs for prefetching
const contentPairs = [
  { videoTitle: "Customer Acquisition", pageTitle: "Need: Customer Acquisition - ARGO Data" },
  { videoTitle: "Customer Engagement", pageTitle: "Need: Customer Engagement - ARGO Data" },
  { videoTitle: "Omni Fulfillment", pageTitle: "Need: Fulfillment - ARGO Data" },
  { videoTitle: "Elevating the Customer Experience", pageTitle: "Need: Customer Experience - Argo Data" },
  { videoTitle: "Safe and Sound Risk Mitigation", pageTitle: "Need: Risk Management - ARGO Data" },
  { videoTitle: "Driving Sales Management Success with ARGO", pageTitle: "Need: Sales Management - ARGO Data" },
  { videoTitle: "Delivering Service Excellence", pageTitle: "Need: Service - ARGO Data" }
];

// Function to check if cache is still valid
const isCacheValid = (timestamp) => {
  return timestamp && (Date.now() - timestamp < queryCache.cacheExpiry);
};

// Prefetch all dynamic reports for common date ranges
const prefetchDynamicReports = async () => {
  // Common date ranges that users are likely to select
  const dateRanges = [
    // Default full range
    { start: "2024-04-01", end: "2025-04-01" },
    
    // Current year to date
    { 
      start: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0]
    },
    
    // Last 3 months
    {
      start: new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0]
    },
    
    // Last month
    {
      start: (() => {
        const date = new Date();
        date.setMonth(date.getMonth() - 1);
        date.setDate(1);
        return date.toISOString().split('T')[0];
      })(),
      end: (() => {
        const date = new Date();
        date.setDate(0); // Last day of previous month
        return date.toISOString().split('T')[0];
      })()
    }
  ];

  console.log("🔄 Prefetching dynamic reports for common date ranges...");
  
  // Process date ranges sequentially to avoid overwhelming the API
  for (const { start, end } of dateRanges) {
    const cacheKey = `${start}_${end}`;
    console.log(`🔍 Prefetching date range: ${start} to ${end}`);
    
    if (!queryCache.dynamicReportPairs[cacheKey]) {
      queryCache.dynamicReportPairs[cacheKey] = {};
    }

    // Process content pairs with limited concurrency
    const PREFETCH_CONCURRENCY = 2; // Lower concurrency for background prefetching
    const pendingPairs = [...contentPairs]; // Clone the array
    
    while (pendingPairs.length > 0) {
      const batch = pendingPairs.splice(0, PREFETCH_CONCURRENCY);
      const batchPromises = batch.map(async (pair) => {
        const { videoTitle, pageTitle } = pair;
        const pairCacheKey = `${videoTitle}_${pageTitle}`;
        
        // Skip if already cached
        if (queryCache.dynamicReportPairs[cacheKey][pairCacheKey] &&
            isCacheValid(queryCache.dynamicReportPairs[cacheKey][pairCacheKey].timestamp)) {
          console.log(`✓ Already cached: "${pageTitle}" / "${videoTitle}"`);
          return;
        }
        
        try {
          console.log(`🎯 Prefetching: "${pageTitle}" and Video: "${videoTitle}"`);
          const queryBatch = createBatchQueries(pageTitle, videoTitle, start, end);
          
          const [response] = await analyticsDataClient.batchRunReports({
            property: `properties/${PROPERTY_ID}`,
            requests: Object.values(queryBatch),
          });
          
          if (!response.reports || response.reports.length === 0) {
            console.warn(`⚠️ No reports returned for Page: "${pageTitle}", Video: "${videoTitle}"`);
            return;
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
          
          queryCache.dynamicReportPairs[cacheKey][pairCacheKey] = {
            data: results,
            timestamp: Date.now()
          };
          
          console.log(`✅ Prefetched: "${pageTitle}" / "${videoTitle}"`);
        } catch (error) {
          console.error(`❌ Error prefetching "${videoTitle}" - "${pageTitle}":`, error.message);
        }
      });
      
      // Wait for current batch to complete before processing the next batch
      await Promise.all(batchPromises);
      
      // Add a small delay between batches to be nice to the API
      if (pendingPairs.length > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }
  
  console.log("✅ Prefetching complete for all date ranges!");
};

// Prefetch main dashboard data
const prefetchMainDashboard = async () => {
  try {
    console.log("🔄 Prefetching main dashboard data...");
    const data = await runMainDashboard("7daysAgo", "yesterday");
    queryCache.mainDashboard = { data, timestamp: Date.now() };
    console.log("✅ Main dashboard data prefetched!");
  } catch (error) {
    console.error("❌ Error prefetching main dashboard:", error.message);
  }
};

// Start prefetching when server starts
(async () => {
  await prefetchMainDashboard();
  await prefetchDynamicReports();
  
  // Set up periodic refresh of cache (every hour)
  setInterval(async () => {
    await prefetchMainDashboard();
    await prefetchDynamicReports();
  }, queryCache.cacheExpiry);
})();

// Reports
app.get('/api/report', async (req, res) => {
  try {
    const reportData = await runNewVsTrueUserReport();
    res.json(reportData);
  } catch (error) {
    console.error('Error fetching GA4 report data:', error);
    res.status(500).json({ message: 'Failed to fetch data from GA4 API' });
  }
});

app.get("/api/main-dashboard", async (req, res) => {
  const { start = "7daysAgo", end = "yesterday" } = req.query;

  try {
    // Return cached data if available and fresh
    if (start === "7daysAgo" && end === "yesterday" && 
        queryCache.mainDashboard.data && 
        isCacheValid(queryCache.mainDashboard.timestamp)) {
      return res.json(queryCache.mainDashboard.data);
    }
    
    const data = await runMainDashboard(start, end);
    
    // Update cache if using default parameters
    if (start === "7daysAgo" && end === "yesterday") {
      queryCache.mainDashboard = { data, timestamp: Date.now() };
    }
    
    res.json(data);
  } catch (error) {
    console.error("Error fetching main dashboard data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/acquisition", async (req, res) => {
  try {
    const data = await runAcquisitionBatch();
    res.json(data);
  } catch (error) {
    console.error("Error fetching acquisition data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/engagement", async (req, res) => {
  try {
    const data = await runEngagementBatch();
    res.json(data);
  } catch (error) {
    console.error("Error fetching engagement data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Dynamic report - optimized with caching
app.get("/api/dynamic-report", async (req, res) => {
  const { pageTitle, videoTitle, start = "2024-04-01", end = "2025-04-01" } = req.query;

  if (!pageTitle || !videoTitle) {
    return res.status(400).json({ error: "Missing required query params: pageTitle or videoTitle" });
  }

  try {
    // Check cache first
    const cacheKey = `${start}_${end}`;
    const pairCacheKey = `${videoTitle}_${pageTitle}`;
    
    if (queryCache.dynamicReportPairs[cacheKey] && 
        queryCache.dynamicReportPairs[cacheKey][pairCacheKey] &&
        isCacheValid(queryCache.dynamicReportPairs[cacheKey][pairCacheKey].timestamp)) {
      return res.json(queryCache.dynamicReportPairs[cacheKey][pairCacheKey].data);
    }
    
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
    
    // Update the cache
    if (!queryCache.dynamicReportPairs[cacheKey]) {
      queryCache.dynamicReportPairs[cacheKey] = {};
    }
    
    queryCache.dynamicReportPairs[cacheKey][pairCacheKey] = {
      data: results,
      timestamp: Date.now()
    };

    res.json(results);
  } catch (error) {
    console.error("❌ Server Error for Page:", pageTitle, "Video:", videoTitle);
    console.error("🔥 Full error details:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    res.status(500).json({ error: "Internal server error" });
  }
});

// Batch endpoint to get all dynamic reports at once
app.get("/api/all-dynamic-reports", async (req, res) => {
  const { start = "2024-04-01", end = "2025-04-01" } = req.query;
  const cacheKey = `${start}_${end}`;
  
  try {
    console.time(`batch-query-${cacheKey}`);
    
    // Return all cached reports if available and valid
    const cacheData = queryCache.dynamicReportPairs[cacheKey];
    if (cacheData && Object.keys(cacheData).length === contentPairs.length) {
      const validCache = Object.values(cacheData).every(item => isCacheValid(item.timestamp));
      if (validCache) {
        const responseData = Object.entries(cacheData).map(([key, value]) => {
          const [videoTitle, pageTitle] = key.split('_');
          return { 
            videoTitle, 
            pageTitle, 
            data: value.data 
          };
        });
        console.log(`✅ Returned complete cache for ${cacheKey}`);
        console.timeEnd(`batch-query-${cacheKey}`);
        return res.json(responseData);
      }
    }
    
    // Check how many items we need to fetch vs retrieve from cache
    const pendingFetches = [];
    const cachedResults = [];
    
    // If partial cache, use what we can and fetch only what we need
    for (const pair of contentPairs) {
      const { videoTitle, pageTitle } = pair;
      const pairCacheKey = `${videoTitle}_${pageTitle}`;
      
      // Check cache for this specific pair
      if (cacheData && 
          cacheData[pairCacheKey] && 
          isCacheValid(cacheData[pairCacheKey].timestamp)) {
        // Use cached item
        cachedResults.push({ 
          videoTitle, 
          pageTitle, 
          data: cacheData[pairCacheKey].data 
        });
      } else {
        // Need to fetch this item
        pendingFetches.push(pair);
      }
    }
    
    console.log(`📊 Using ${cachedResults.length} cached items, fetching ${pendingFetches.length} items`);
    
    // If all items are cached, return immediately
    if (pendingFetches.length === 0) {
      console.log(`✅ Returned all items from cache for ${cacheKey}`);
      console.timeEnd(`batch-query-${cacheKey}`);
      return res.json(cachedResults);
    }
    
    // Execute fetch for all pending items in parallel (with concurrency limit)
    // This prevents hitting API rate limits while still being fast
    const CONCURRENCY_LIMIT = 3; // Fetch up to 3 queries at a time
    const fetchedResults = [];
    
    // Helper function to fetch in batches with limited concurrency
    const fetchBatch = async (items, batchSize) => {
      for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        const batchPromises = batch.map(async (pair) => {
          const { videoTitle, pageTitle } = pair;
          const pairCacheKey = `${videoTitle}_${pageTitle}`;
          
          try {
            const queryBatch = createBatchQueries(pageTitle, videoTitle, start, end);
            const [response] = await analyticsDataClient.batchRunReports({
              property: `properties/${PROPERTY_ID}`,
              requests: Object.values(queryBatch),
            });
            
            if (!response.reports || response.reports.length === 0) {
              console.warn(`⚠️ No reports returned for Page: "${pageTitle}", Video: "${videoTitle}"`);
              return { videoTitle, pageTitle, data: [] };
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
            
            // Update cache
            if (!queryCache.dynamicReportPairs[cacheKey]) {
              queryCache.dynamicReportPairs[cacheKey] = {};
            }
            
            queryCache.dynamicReportPairs[cacheKey][pairCacheKey] = {
              data: results,
              timestamp: Date.now()
            };
            
            return { videoTitle, pageTitle, data: results };
          } catch (err) {
            console.error(`❌ Error fetching "${videoTitle}" - "${pageTitle}":`, err.message);
            return { videoTitle, pageTitle, data: [] };
          }
        });
        
        // Wait for current batch to complete
        const batchResults = await Promise.all(batchPromises);
        fetchedResults.push(...batchResults);
      }
    };
    
    // Execute fetch with concurrency limit
    await fetchBatch(pendingFetches, CONCURRENCY_LIMIT);
    
    // Combine cached and fetched results
    const combinedResults = [...cachedResults, ...fetchedResults];
    
    console.log(`✅ Returned combined results (${cachedResults.length} cached, ${fetchedResults.length} fetched) for ${cacheKey}`);
    console.timeEnd(`batch-query-${cacheKey}`);
    res.json(combinedResults);
  } catch (error) {
    console.error("❌ Batch reports error:", error);
    console.timeEnd(`batch-query-${cacheKey}`);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Server health and cache status endpoint
app.get("/api/cache-status", (req, res) => {
  const cacheInfo = {
    mainDashboard: queryCache.mainDashboard && queryCache.mainDashboard.timestamp ? {
      timestamp: new Date(queryCache.mainDashboard.timestamp).toISOString(),
      age: (Date.now() - queryCache.mainDashboard.timestamp) / 1000,
      isValid: isCacheValid(queryCache.mainDashboard.timestamp)
    } : null,
    dynamicReports: {}
  };
  
  // Add info about all cached date ranges
  Object.keys(queryCache.dynamicReportPairs).forEach(dateRange => {
    const pairs = queryCache.dynamicReportPairs[dateRange];
    const pairInfo = {};
    
    Object.keys(pairs).forEach(pair => {
      const timestamp = pairs[pair].timestamp;
      pairInfo[pair] = {
        timestamp: new Date(timestamp).toISOString(),
        age: (Date.now() - timestamp) / 1000,
        isValid: isCacheValid(timestamp)
      };
    });
    
    cacheInfo.dynamicReports[dateRange] = {
      pairs: pairInfo,
      count: Object.keys(pairs).length,
      complete: Object.keys(pairs).length === contentPairs.length
    };
  });
  
  res.json({
    status: 'ok',
    cache: cacheInfo,
    serverTime: new Date().toISOString(),
    cacheExpiry: queryCache.cacheExpiry / 1000 / 60 + ' minutes'
  });
});

// ✅ New GPT insight route
app.post("/api/custom-insight", async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: "Missing user query." });

  try {
    const { ArgoAgents } = require("./agentFlow");
    const agentSystem = new ArgoAgents();

    const result = await agentSystem.runWorkflow(query);

    const raw = result?.data?.result || "";

    const cleaned = raw
      .replace(/\\n/g, '\n')
      .replace(/###\s*(.+?)\s*\n/g, '\n\n$1\n' + '-'.repeat(40) + '\n')
      .trim();

    res.send(cleaned);
  } catch (err) {
    console.error("LLM error:", err);
    res.status(500).json({ error: "Failed to generate GPT insights." });
  }
});


app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
