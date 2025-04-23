import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import {
  Select,
  MenuItem,
  Typography,
  Card,
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighlightedCard from "./HighlightedCard";
import Box from "@mui/material/Box";

// Client-side cache utilities
const CACHE_EXPIRY = 15 * 60 * 1000; // 15 minutes in milliseconds

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

const DashboardTables = () => {
  const [chartData, setChartData] = useState([]);
  const [startDate, setStartDate] = useState("7daysAgo");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Try to get data from cache first
      const cacheKey = `dashboard_${startDate}`;
      const cachedData = getFromCache(cacheKey);
      
      if (cachedData) {
        console.log("Using cached dashboard data");
        setChartData(cachedData);
        setLoading(false);
        setError(null);
        return;
      }
      
      try {
        const response = await axios.get(
          `http://localhost:5001/api/main-dashboard?start=${startDate}&end=yesterday`
        );

        const rows = response.data?.[0]?.rows || [];
        const formatted = rows.map((row) => ({
          date: row.dimensions[0],
          newUsers: parseInt(row.metrics[2], 10) || 0,
          activeUsers: parseInt(row.metrics[0], 10) || 0,
          keyEvents: parseInt(row.metrics[1], 10) || 0,
          userEngagementDuration: parseInt(row.metrics[3], 10) || 0,
        }))
        .sort((a, b) => {
          const aDate = dayjs(a.date, "YYYYMMDD");
          const bDate = dayjs(b.date, "YYYYMMDD");
          return aDate - bDate;
        });

        // Save to cache
        saveToCache(cacheKey, formatted);
        setChartData(formatted);
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const formatDate = (date) => dayjs(date, "YYYYMMDD").format("MMM DD");

  const NewUsers = {
    chart: { type: "spline", height: 150 },
    title: { text: "New Users" },
    xAxis: { categories: chartData.map(entry => formatDate(entry.date)), visible: false },
    yAxis: { title: { text: "Users" }, visible: false },
    series: [{ name: "New Users", data: chartData.map(e => e.newUsers),marker: { enabled: false }, color: "#43A047" }],
    credits: {
      enabled: false
    }
  };

  const ActiveUsers = {
    chart: { type: "spline", height: 150 },
    title: { text: "Active Users" },
    xAxis: { categories: chartData.map(entry => formatDate(entry.date)), visible: false },
    yAxis: { title: { text: "Users" }, visible: false },
    series: [{ name: "Active Users", data: chartData.map(e => e.activeUsers),marker: { enabled: false }, color: "#01579B" }],
    credits: {
      enabled: false
    }
  };

  const KeyEvents = {
    chart: { type: "spline", height: 150 },
    title: { text: "Key Events" },
    xAxis: { categories: chartData.map(entry => formatDate(entry.date)), visible: false },
    yAxis: { title: { text: "Events" }, visible: false },
    series: [{ name: "Key Events", data: chartData.map(e => e.keyEvents),marker: { enabled: false }, color: "#1976D2" }],
    credits: {
      enabled: false
    }
  };

  const UserEngage = {
    chart: { type: "spline", height: 150 },
    title: { text: "Avg Engagement (mins)" },
    xAxis: { categories: chartData.map(entry => formatDate(entry.date)), visible: false },
    yAxis: { visible: false },
    series: [{
      name: "Engagement",
      data: chartData.map(e => Math.round(e.userEngagementDuration / 60)),
      marker: { enabled: false },
      color: "#29B6F6"
    }],
    credits: {
      enabled: false
    }
  };

  const NewVsActive = {
    chart: { type: "spline" },
    title: { text: "New vs Active Users" },
    xAxis: { categories: chartData.map(entry => formatDate(entry.date)), title: { text: "Date" } },
    yAxis: { title: { text: "Users" } },
    tooltip: { shared: true, crosshairs: true },
    series: [
      { name: "New Users", data: chartData.map(e => e.newUsers), color: "#03A9F4" },
      { name: "Active Users", data: chartData.map(e => e.activeUsers), color: "#01579B" }
    ],
    credits: {
      enabled: false
    }
  };

  return (
    <>
     
      
      <Grid size={{xs:12 , sm:12, lg:12, md:12}}>
      <Typography variant="h4" sx={{ mb: 1, color:'#01579B'}}>Set Date Range</Typography>
      <Select
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        size="small"
        sx={{ mb: 2 }}
      >
        <MenuItem value="7daysAgo">Last 7 Days</MenuItem>
        <MenuItem value="28daysAgo">Last 28 Days</MenuItem>
        <MenuItem value="30daysAgo">Last 30 Days</MenuItem>
        <MenuItem value="365daysAgo">Last Year</MenuItem>
      </Select>
      </Grid>

      <Grid size={{ xs: 5, sm: 6, lg: 3 }}>
        <Card variant="outlined" sx={{ maxHeight: '200px', height: '100%', flexGrow: 1 , width: '100%'}}>
          <HighchartsReact highcharts={Highcharts} options={NewUsers} />
        </Card>
      </Grid>
      <Grid size={{ xs: 5, sm: 6, lg: 3 }}>
        <Card variant="outlined" sx={{ maxHeight: '200px', height: '100%', flexGrow: 1 , width: '100%'}}>
          <HighchartsReact highcharts={Highcharts} options={ActiveUsers} />
        </Card>
      </Grid>
      <Grid size={{ xs: 5, sm: 6, lg: 3 }}>
        <Card variant="outlined" sx={{ maxHeight: '200px', height: '100%', flexGrow: 1 , width: '100%'}}>
          <HighchartsReact highcharts={Highcharts} options={KeyEvents} />
        </Card>
      </Grid>
      <Grid size={{ xs: 5, sm: 6, lg: 3 }}>
        <Card variant="outlined" sx={{ maxHeight: '200px', height: '100%', flexGrow: 1 , width: '100%'}}>
          <HighchartsReact highcharts={Highcharts} options={UserEngage} />
        </Card>
      </Grid>
      <Grid size={{ xs: 12, md: 6}}>
        <Card variant="outlined" sx={{width: '100%'}}>
          <HighchartsReact highcharts={Highcharts} options={NewVsActive} />
        </Card>
      </Grid>
      
    </>
  );
};

export default DashboardTables;
