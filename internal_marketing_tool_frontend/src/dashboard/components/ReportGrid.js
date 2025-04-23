import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import axios from "axios";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Card from "@mui/material/Card";
import Copyright from "../internals/components/Copyright";
import { Collapse, Button } from "@mui/material";

// Format month & year safely using UTC
const formatMonthYear = (month, year) => {
  const date = new Date(Date.UTC(year, month - 1, 1));
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    timeZone: "UTC",
  });
};

// Client-side cache utilities
const CACHE_EXPIRY = 60 * 60 * 1000; // 1 hour in milliseconds

const saveToCache = (key, data) => {
  try {
    const cacheData = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(key, JSON.stringify(cacheData));
  } catch (error) {
    console.warn("Failed to save to cache:", error);
  }
};

const getFromCache = (key) => {
  try {
    const cachedData = localStorage.getItem(key);
    if (!cachedData) return null;
    
    const { data, timestamp } = JSON.parse(cachedData);
    if (Date.now() - timestamp > CACHE_EXPIRY) {
      // Cache expired
      localStorage.removeItem(key);
      return null;
    }
    
    return data;
  } catch (error) {
    console.warn("Failed to retrieve from cache:", error);
    return null;
  }
};

// Build Highcharts configs for one page/video report pair
const buildChartsForPair = ({ pageTitle, videoTitle, pageReport, videoReport, videoLength }) => {
  const categories = pageReport.data.rows.map((row) =>
    formatMonthYear(parseInt(row.dimensions[0]), parseInt(row.dimensions[1]))
  );

  const videoLengthInSec = (() => {
    const [min, sec] = videoLength.split(":").map(Number);
    return min * 60 + sec;
  })();

  const engagementTimeData = videoReport.data.rows.map((row) => {
    const percentWatched = Number(row.dimensions[1]);
    const time = Math.round((percentWatched / 100) * videoLengthInSec);
    const eventCount = Number(row.metrics[0]);
    return {
      y: time,
      eventCount: eventCount
    };
  });

  const engagementTimeChart = {
    chart: { type: "bar" },
    title: { text: `${videoTitle} - Engagement Time Watched` },
    xAxis: {
      categories: videoReport.data.rows.map((r) => Number(r.metrics[0])),
      title: { text: "Event Count" },
    },
    yAxis: {
      title: { text: "Time Watched (min:sec)" },
      tickPositions: [
        0,
        Math.round(videoLengthInSec * 0.10),
        Math.round(videoLengthInSec * 0.25),
        Math.round(videoLengthInSec * 0.50),
        Math.round(videoLengthInSec * 0.75),
        videoLengthInSec
      ],
      labels: {
        formatter: function () {
          const minutes = Math.floor(this.value / 60);
          const seconds = this.value % 60;
          return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
      }
    },
    tooltip: {
      shared: true,
      crosshairs: true,
      formatter: function () {
        const point = this.points[0].point;
        const minutes = Math.floor(point.y / 60);
        const seconds = point.y % 60;
        const formatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        const eventCount = point.eventCount;
        return `<b>Event Count: ${eventCount}</b><br/><span style='color:${this.points[0].color}'>●</span> Engagement Time: <b>${formatted}</b>`;
      }
    },
    series: [
      {
        name: "Engagement Time",
        data: engagementTimeData,
        color: "#01579B"
      }
    ],
    credits: {
      enabled: false
    }
  };

  return {
    engagementRateChart: {
      chart: { type: "spline" },
      title: { text: `${pageTitle} - Engagement Rate` },
      xAxis: { categories, title: { text: "Month" } },
      yAxis: {
        title: { text: "Engagement Rate" },
        max: 100,
        labels: {
          formatter: function () { return this.value + "%"; }
        }
      },
      tooltip: {
        shared: true,
        crosshairs: true,
        valueFormatter: function () { return this.y + "%"; }
      },
      series: [
        {
          name: "Engagement Rate",
          data: pageReport.data.rows.map((r) => Math.round(Number(r.metrics[0]) * 100)),
          color: "#1976D2",
        },
      ],
      credits: {
        enabled: false
      }
    },
    pageViewsChart: {
      chart: { type: "spline" },
      title: { text: `${pageTitle} - Page Views` },
      xAxis: { categories, title: { text: "Month" } },
      yAxis: { title: { text: "Page Views" } },
      tooltip: { shared: true, crosshairs: true },
      series: [
        {
          name: "Page Views",
          data: pageReport.data.rows.map((r) => Number(r.metrics[4])),
          color: "#29B6F6",
        },
      ],
      credits: {
        enabled: false
      }
    },
    totalVsNewUsersChart: {
      chart: { type: "spline" },
      title: { text: `${pageTitle} - New vs Total Users` },
      xAxis: { categories, title: { text: "Month" } },
      yAxis: { title: { text: "Users" } },
      tooltip: { shared: true, crosshairs: true },
      series: [
        {
          name: "New Users",
          data: pageReport.data.rows.map((r) => Number(r.metrics[2])),
          color: "#1976D2",
        },
        {
          name: "Total Users",
          data: pageReport.data.rows.map((r) => Number(r.metrics[3])),
          color: "#4FC3F7",
        },
      ],
      credits: {
        enabled: false
      }
    },
    videoRetentionChart: {
      chart: { type: "spline" },
      title: { text: `${videoTitle} - Video Retention` },
      xAxis: {
        categories: videoReport.data.rows.map((row) => `${row.dimensions[1]}%`),
        title: { text: "Percent Watched" },
      },
      yAxis: { title: { text: "Event Count" } },
      tooltip: { shared: true, crosshairs: true },
      series: [
        {
          name: "Event Count",
          data: videoReport.data.rows.map((r) => Number(r.metrics[0])),
          color: "#01579B",
        },
      ],
      credits: {
        enabled: false
      }
    },
    engagementTimeChart
  };
};

const calculateAverages = (pairs) => {
  let engagementRates = [];
  let pageViews = [];
  let newUsers = [];
  let totalUsers = [];

  for (const pair of pairs) {
    const rows = pair.pageReport.data.rows;
    for (const row of rows) {
      engagementRates.push(Number(row.metrics[0]) * 100);
      pageViews.push(Number(row.metrics[4]));
      newUsers.push(Number(row.metrics[2]));
      totalUsers.push(Number(row.metrics[3]));
    }
  }

  const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length || 0;

  return {
    avgEngagementRate: avg(engagementRates).toFixed(2),
    avgPageViews: avg(pageViews).toFixed(0),
    avgNewUsers: avg(newUsers).toFixed(0),
    avgTotalUsers: avg(totalUsers).toFixed(0),
  };
};

export default function ReportGrid() {
  const [reportPairs, setReportPairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({}); // Track expanded sections
  const [dataSource, setDataSource] = useState(''); // Track if data is from server or cache
  const [lastUpdated, setLastUpdated] = useState(null); // When data was last retrieved

  // Default range: last year to today
  const [startDate, setStartDate] = useState("2024-04-01");
  const [endDate, setEndDate] = useState("2025-04-01");

  const videoTitles = [
    "Customer Acquisition",
    "Customer Engagement",
    "Omni Fulfillment",
    "Elevating the Customer Experience",
    "Safe and Sound Risk Mitigation",
    "Driving Sales Management Success with ARGO",
    "Delivering Service Excellence"
  ];

  const pageTitles = [
    "Need: Customer Acquisition - ARGO Data",
    "Need: Customer Engagement - ARGO Data",
    "Need: Fulfillment - ARGO Data",
    "Need: Customer Experience - Argo Data",
    "Need: Risk Management - ARGO Data",
    "Need: Sales Management - ARGO Data",
    "Need: Service - ARGO Data"
  ];

  const sectionNames = [
    "Customer Acquisition page report",
    "Customer Engagement page report",
    "Fulfillment page report",
    "Customer Experience page report",
    "Risk Management page report",
    "Sales Management page report",
    "Service page report"
  ];

  const videoLengths = [
    "6:41",
    "3:08",
    "5:17",
    "5:07",
    "5:22",
    "3:31",
    "4:10"
  ];

  const fetchData = async (start, end) => {
    setLoading(true);
    
    // Check client-side cache first
    const cacheKey = `reports_${start}_${end}`;
    const cachedData = getFromCache(cacheKey);
    
    if (cachedData) {
      console.log("Using cached report data");
      setReportPairs(cachedData);
      setLoading(false);
      setDataSource('cache');
      setLastUpdated(Date.now());
      return;
    }
    
    // Progressive loading - show existing data while fetching new data
    // Find closest date range in cache, if any
    let closestCacheData = null;
    try {
      // Check for any cached date ranges
      const cacheKeys = Object.keys(localStorage).filter(key => key.startsWith('reports_'));
      if (cacheKeys.length > 0) {
        // Use the most recent cache as a temporary view
        const mostRecentKey = cacheKeys.sort((a, b) => {
          const aData = JSON.parse(localStorage.getItem(a));
          const bData = JSON.parse(localStorage.getItem(b));
          return bData.timestamp - aData.timestamp;
        })[0];
        
        closestCacheData = JSON.parse(localStorage.getItem(mostRecentKey)).data;
        // Show the cached data immediately while loading
        if (closestCacheData && closestCacheData.length > 0) {
          setReportPairs(closestCacheData);
          setLoading(false); // Show UI with cached data
          setDataSource('cache');
          setLastUpdated(Date.now());
        }
      }
    } catch (err) {
      console.warn("Error finding closest cache:", err);
    }
    
    // In parallel, start prefetching the next likely date range
    const prefetchNextDateRange = () => {
      // Calculate common next ranges based on current selection
      const nextRanges = [];
      
      // If user selected a month, prefetch the previous/next month
      if (start.includes('-')) {
        const date = new Date(start);
        // Previous month
        date.setMonth(date.getMonth() - 1);
        const prevMonth = date.toISOString().split('T')[0];
        
        // Next month
        date.setMonth(date.getMonth() + 2); // +2 because we did -1 before
        const nextMonth = date.toISOString().split('T')[0];
        
        nextRanges.push([prevMonth, end]);
        nextRanges.push([nextMonth, end]);
      }
      
      // Prefetch each range in the background
      nextRanges.forEach(([nextStart, nextEnd]) => {
        const nextCacheKey = `reports_${nextStart}_${nextEnd}`;
        if (!getFromCache(nextCacheKey)) {
          console.log(`Prefetching next likely range: ${nextStart} to ${nextEnd}`);
          fetch(`http://localhost:5001/api/all-dynamic-reports?start=${nextStart}&end=${nextEnd}`)
            .catch(err => console.warn("Error prefetching:", err));
        }
      });
    };
    
    const pairs = [];

    try {
      // Set a flag to track if we need to update the UI
      let needUIUpdate = !closestCacheData;
      
      // Use the new batch endpoint instead of making 7 separate requests
      const res = await axios.get("http://localhost:5001/api/all-dynamic-reports", {
        params: { start, end },
      });

      for (const item of res.data) {
        const { videoTitle, pageTitle, data } = item;
        
        if (data?.length > 0) {
          const [pageData, videoData] = data;

          if (pageData?.rows?.length && videoData?.rows?.length) {
            // Sort by year/month
            pageData.rows.sort((a, b) => {
              const dateA = new Date(a.dimensions[1], a.dimensions[0] - 1);
              const dateB = new Date(b.dimensions[1], b.dimensions[0] - 1);
              return dateA - dateB;
            });

            videoData.rows.sort((a, b) => {
              const percentA = Number(a.dimensions?.[1] ?? "0");
              const percentB = Number(b.dimensions?.[1] ?? "0");
              return percentA - percentB;
            });

            pairs.push({
              pageTitle,
              videoTitle,
              pageReport: { title: pageTitle, data: pageData },
              videoReport: { title: videoTitle, data: videoData },
            });
          }
        }
      }

      // Save to client-side cache
      saveToCache(cacheKey, pairs);
      
      // Update UI if we have new data or if we didn't show temp data earlier
      if (needUIUpdate || pairs.length > 0) {
        setReportPairs(pairs);
      }
      
      // Start prefetching next likely ranges
      setTimeout(prefetchNextDateRange, 2000);

      setDataSource('server');
      setLastUpdated(Date.now());
    } catch (err) {
      console.error(`Error fetching reports:`, err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add keyboard shortcut for faster navigation between date ranges
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Arrow left/right to navigate between common date ranges
      if (e.altKey && e.key === 'ArrowLeft') {
        // Go to previous month/period
        const date = new Date(startDate);
        date.setMonth(date.getMonth() - 1);
        const newDate = date.toISOString().split('T')[0];
        setStartDate(newDate);
        fetchData(newDate, endDate);
      } else if (e.altKey && e.key === 'ArrowRight') {
        // Go to next month/period
        const date = new Date(startDate);
        date.setMonth(date.getMonth() + 1);
        const newDate = date.toISOString().split('T')[0];
        setStartDate(newDate);
        fetchData(newDate, endDate);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [startDate, endDate]);

  // Add initial data load effect
  useEffect(() => {
    fetchData(startDate, endDate);
  }, []);
  
  // Common date ranges for quick selection
  const predefinedDateRanges = [
    { label: 'Last Month', start: (() => {
      const date = new Date();
      date.setMonth(date.getMonth() - 1);
      date.setDate(1);
      return date.toISOString().split('T')[0];
    })(), end: (() => {
      const date = new Date();
      date.setDate(0); // Last day of previous month
      return date.toISOString().split('T')[0];
    })() },
    { label: 'Last 3 Months', start: (() => {
      const date = new Date();
      date.setMonth(date.getMonth() - 3);
      return date.toISOString().split('T')[0];
    })(), end: (() => {
      return new Date().toISOString().split('T')[0];
    })() },
    { label: 'Year to Date', start: (() => {
      const date = new Date();
      date.setMonth(0);
      date.setDate(1);
      return date.toISOString().split('T')[0];
    })(), end: (() => {
      return new Date().toISOString().split('T')[0];
    })() },
    { label: 'Last Year', start: (() => {
      const date = new Date();
      date.setFullYear(date.getFullYear() - 1);
      date.setMonth(0);
      date.setDate(1);
      return date.toISOString().split('T')[0];
    })(), end: (() => {
      const date = new Date();
      date.setFullYear(date.getFullYear() - 1);
      date.setMonth(11);
      date.setDate(31);
      return date.toISOString().split('T')[0];
    })() },
  ];

  const toggleAllCharts = (sectionIndex) => {
    setExpandedSections((prevState) => {
      const isExpanded = prevState[sectionIndex];
      return { ...prevState, [sectionIndex]: !isExpanded };
    });
  };

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" }, mx: "auto" }}>
      {/* Date Range Form */}
      <Box sx={{ mb: 4, mt: 6 }}>
        <Typography variant="h4" sx={{ mb: 1, color: '#01579B' }}>
          Set Date Range
        </Typography>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchData(startDate, endDate);
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Typography variant="body1" sx={{ color: 'text.secondary', mr: 1 }}>
                Start Date:
              </Typography>
            </Grid>
            <Grid item>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  backgroundColor: 'transparent',
                  color: 'inherit',
                  fontFamily: 'inherit',
                  fontSize: '1rem',
                }}
              />
            </Grid>
            <Grid item>
              <Typography variant="body1" sx={{ color: 'text.secondary', mx: 1 }}>
                End Date:
              </Typography>
            </Grid>
            <Grid item>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  backgroundColor: 'transparent',
                  color: 'inherit',
                  fontFamily: 'inherit',
                  fontSize: '1rem',
                }}
              />
            </Grid>
            <Grid item>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: '#01579B',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#014477',
                  },
                  ml: 2
                }}
              >
                Fetch Reports
              </Button>
            </Grid>
          </Grid>
          
          {/* Quick Date Range Selection */}
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item>
              <Typography variant="body1" sx={{ color: 'text.secondary', mr: 1 }}>
                Quick Select:
              </Typography>
            </Grid>
            {predefinedDateRanges.map((range, index) => (
              <Grid item key={index}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    setStartDate(range.start);
                    setEndDate(range.end);
                    fetchData(range.start, range.end);
                  }}
                  sx={{
                    borderColor: '#01579B',
                    color: '#01579B',
                    '&:hover': {
                      backgroundColor: 'rgba(1, 87, 155, 0.04)',
                      borderColor: '#01579B',
                    }
                  }}
                >
                  {range.label}
                </Button>
              </Grid>
            ))}
          </Grid>
        </form>
      </Box>

      {/* Data Freshness Indicator */}
      {!loading && lastUpdated && (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, px: 2 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
            Data {dataSource === 'cache' ? 'from cache' : 'refreshed'} {' '}
            {new Date(lastUpdated).toLocaleTimeString()} {' '}
            {dataSource === 'cache' && (
              <Button 
                variant="text" 
                size="small" 
                onClick={() => fetchData(startDate, endDate)}
                sx={{ 
                  ml: 1, 
                  minWidth: 'auto', 
                  p: '2px 6px', 
                  color: '#01579B', 
                  textTransform: 'none',
                  '&:hover': { backgroundColor: 'rgba(1, 87, 155, 0.04)' }
                }}
              >
                Refresh
              </Button>
            )}
          </Typography>
        </Box>
      )}

      {/* Averages Overview */}
      {!loading && (
        <Box sx={{ px: 2, mt: 4, mb: 6 }}>
          <Card variant="outlined" sx={{ p: 2, width: '100%' }}>
            <Typography variant="h5" sx={{ mb: 2, color: '#01579B' }}>
              Averages Overview
            </Typography>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc', paddingBottom: '8px' }}>Metric</th>
                  <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc', paddingBottom: '8px' }}>Average</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const { avgEngagementRate, avgPageViews, avgNewUsers, avgTotalUsers } = calculateAverages(reportPairs);
                  return (
                    <>
                      <tr>
                        <td style={{ padding: '8px 0' }}>Avg. Engagement Rate</td>
                        <td>{avgEngagementRate}%</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '8px 0' }}>Avg. Page Views</td>
                        <td>{avgPageViews}</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '8px 0' }}>Avg. New Users</td>
                        <td>{avgNewUsers}</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '8px 0' }}>Avg. Total Users</td>
                        <td>{avgTotalUsers}</td>
                      </tr>
                    </>
                  );
                })()}
              </tbody>
            </table>
          </Card>
        </Box>
      )}

      {/* Display Sections */}
      {loading ? (
        <Typography sx={{ px: 2 }}>Loading reports...</Typography>
      ) : (
        <Grid container spacing={6}>
          {reportPairs.map((pair, i) => {
            const charts = buildChartsForPair({ ...pair, videoLength: videoLengths[i] });

            return (
              <Grid item xs={12} key={`pair-${i}`}>
                <Box sx={{ width: "100%", px: 2 }}>
                  <Card variant="outlined" sx={{ width: '100%' }}>
                    <Typography variant="h6" sx={{ mb: 1, color: "#01579B" }}>
                      {sectionNames[i]}
                    </Typography>

                    {/* Display the first two charts always */}
                    <Grid container spacing={3}>
                      <Grid item lg={4} xs={12} sm={6} md={4}>
                        <Box sx={{ maxWidth: 525, mx: "auto" }}>
                          <Card variant="outlined" sx={{ width: '100%' }}>
                            <HighchartsReact highcharts={Highcharts} options={charts.engagementRateChart} />
                          </Card>
                        </Box>
                      </Grid>
                      <Grid item lg={4} xs={12} sm={6} md={6}>
                        <Box sx={{ maxWidth: 525, mx: "auto" }}>
                          <Card variant="outlined" sx={{ width: '100%' }}>
                            <HighchartsReact highcharts={Highcharts} options={charts.pageViewsChart} />
                          </Card>
                        </Box>
                      </Grid>
                    

                    {/* Toggleable charts */}
                    {["totalVsNewUsersChart", "videoRetentionChart", "engagementTimeChart"].map((chartKey) => (
                        <Collapse in={expandedSections[i]}>
                            <Grid item lg={4} xs={12} sm={6} md={6}>
                              <Box sx={{ maxWidth: 525, mx: "auto" }}>
                                <Card variant="outlined" sx={{ width: '100%' }}>
                                  <HighchartsReact highcharts={Highcharts} options={charts[chartKey]} />
                                </Card>
                              </Box>
                            </Grid>
                        </Collapse>
                    ))}
                    </Grid>
                    <Button
                      variant="contained"
                      onClick={() => toggleAllCharts(i)}
                      sx={{ marginBottom: "10px", backgroundColor: "#01579B", color: "white"}}
                    >
                      {expandedSections[i] ? "Collapse" : "Expand"}
                    </Button>
                  </Card>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      )}

      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}
