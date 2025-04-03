import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import axios from "axios";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Copyright from "../internals/components/Copyright";
import Card from "@mui/material/Card";

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
const buildChartsForPair = ({ pageTitle, videoTitle, pageReport, videoReport }) => {
  const categories = pageReport.data.rows.map((row) =>
    formatMonthYear(parseInt(row.dimensions[0]), parseInt(row.dimensions[1]))
  );

  return {
    engagementRateChart: {
      chart: { type: "spline" },
      title: { text: `${pageTitle} - Engagement Rate` },
      xAxis: { categories, title: { text: "Month" } },
      yAxis: { title: { text: "Engagement Rate" } },
      tooltip: { shared: true, crosshairs: true },
      series: [
        {
          name: "Engagement Rate",
          data: pageReport.data.rows.map((r) => Number(r.metrics[0])),
          color: "#1976D2",
        },
      ],
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
    },
  };
};

export default function ReportGrid() {
  const [reportPairs, setReportPairs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Default range: last year to today
  const [startDate, setStartDate] = useState("2024-04-01");
  const [endDate, setEndDate] = useState("2025-04-01");

  const videoTitles = [
    "Delivering Service Excellence",
    "Customer Engagement",
    "Omni Fulfillment",
    "Safe and Sound Risk Mitigation",
  ];

  const pageTitles = [
    "Customer Acquisition",
    "Connects Customer Engagement - ARGO Data",
    "Connects Omni Fulfillment - ARGO Data",
    "Customer Experience - ARGO Data",
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

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" }, mx: "auto" }}>
      

      {/* Date Range Form */}
      <Box sx={{ mb: 4, px: 2 }}>
        <Typography variant="h3" sx={{ mb: 1 }}>
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

      {loading ? (
        <Typography sx={{ px: 2 }}>Loading reports...</Typography>
      ) : (
        <Grid container spacing={6}>
          {reportPairs.map((pair, i) => {
            const charts = buildChartsForPair(pair);
            return (
              <Grid item xs={12} key={`pair-${i}`}>
                <Box sx={{ width: "100%", px: 2 }}>
                  <Typography variant="h6" sx={{ mb: 1, color: "#01579B"}}>
                    {pair.pageTitle} &mdash; {pair.videoTitle}
                  </Typography>

                  <Grid container spacing={4}>
                    <Grid item xs={12} sm={6} md={6}>
                      <Box sx={{ maxWidth: 550, mx: "auto" }}>
                        <Card variant="outlined" sx={{width: '100%'}}>
                          <HighchartsReact highcharts={Highcharts} options={charts.engagementRateChart} />
                        </Card>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <Box sx={{ maxWidth: 550, mx: "auto" }}>
                        <Card variant="outlined" sx={{width: '100%'}}>
                          <HighchartsReact highcharts={Highcharts} options={charts.pageViewsChart} />
                        </Card>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <Box sx={{ maxWidth: 550, mx: "auto" }}>
                        <Card variant="outlined" sx={{width: '100%'}}>
                          <HighchartsReact highcharts={Highcharts} options={charts.totalVsNewUsersChart} />
                        </Card>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                      <Box sx={{ maxWidth: 550, mx: "auto" }}>
                        <Card variant="outlined" sx={{width: '100%'}}>
                          <HighchartsReact highcharts={Highcharts} options={charts.videoRetentionChart} />
                        </Card>
                      </Box>
                    </Grid>
                  </Grid>
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
