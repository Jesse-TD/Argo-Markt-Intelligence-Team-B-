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
  const [expandedSections, setExpandedSections] = useState([0]); // Tracks expanded sections

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
    const pairs = [];

    for (let i = 0; i < videoTitles.length; i++) {
      const videoTitle = videoTitles[i].trim();
      const pageTitle = pageTitles[i].trim();

      try {
        const res = await axios.get("http://localhost:5000/api/dynamic-report", {
          params: { videoTitle, pageTitle, start, end },
        });

        if (res.data?.length > 0) {
          const [pageData, videoData] = res.data;

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
      } catch (err) {
        console.error(`Error fetching pair ${i + 1}:`, err.message);
      }
    }

    setReportPairs(pairs);
    setLoading(false);
  };

  useEffect(() => {
    fetchData(startDate, endDate);
  }, []);

  const toggleSection = (index) => {
    setExpandedSections((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" }, mx: "auto" }}>
      {/* Date Range Form */}
      <Box sx={{ mb: 4, px: 2 }}>
        <Typography variant="h3" sx={{ mb: 1, color:'#01579B'}}>
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
              <label htmlFor="start-date">Start Date:</label>
            </Grid>
            <Grid item>
              <input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </Grid>
            <Grid item>
              <label htmlFor="end-date">End Date:</label>
            </Grid>
            <Grid item>
              <input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </Grid>
            <Grid item>
              <button type="submit">Fetch Reports</button>
            </Grid>
          </Grid>
        </form>
      </Box>

      {/* Averages Overview */}
      {!loading && (
        <Box sx={{ px: 2, mt: 4, mb:6 }}>
          <Card variant="outlined" sx={{ p: 2 , border: '1px solid', width: '100%' }}>
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
                  <Card variant="outlined" sx={{ border: '1px solid', width: '100%' }}>
                    <Typography variant="h6" sx={{ mb: 1, color: "#01579B" }}>
                      {sectionNames[i]}
                    </Typography>

                    <Button
                      variant="contained"
                      onClick={() => toggleSection(i)}
                      sx={{ marginBottom: "10px", backgroundColor: "#01579B", color: "white" }}
                    >
                      {expandedSections.includes(i) ? "Collapse" : "Expand"}
                    </Button>

                    {/* Collapsible Section */}
                    <Collapse in={expandedSections.includes(i)}>
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
                        <Grid item lg={4} xs={12} sm={6} md={6}>
                          <Box sx={{ maxWidth: 525, mx: "auto" }}>
                            <Card variant="outlined" sx={{ width: '100%' }}>
                              <HighchartsReact highcharts={Highcharts} options={charts.totalVsNewUsersChart} />
                            </Card>
                          </Box>
                        </Grid>
                        <Grid item lg={4} xs={12} sm={6} md={6}>
                          <Box sx={{ maxWidth: 525, mx: "auto" }}>
                            <Card variant="outlined" sx={{ width: '100%' }}>
                              <HighchartsReact highcharts={Highcharts} options={charts.videoRetentionChart} />
                            </Card>
                          </Box>
                        </Grid>
                        <Grid item lg={4} xs={12} sm={6} md={6}>
                          <Box sx={{ maxWidth: 525, mx: "auto" }}>
                            <Card variant="outlined" sx={{ width: '100%' }}>
                              <HighchartsReact highcharts={Highcharts} options={charts.engagementTimeChart} />
                            </Card>
                          </Box>
                        </Grid>
                      </Grid>
                    </Collapse>
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

