import React, { useEffect, useState } from "react";
import axios from "axios";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import { Typography } from "@mui/material";
import HighlightedCard from "./HighlightedCard";

const DashboardTables = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/main-dashboard");
  
        console.log("Fetched Data:", response.data); //  Log full API response
  
        //  Ensure response.data[0] exists before accessing `rows`
        if (!response.data || !response.data[0] || !response.data[0].rows) {
          throw new Error("Invalid API response structure");
        }
  
        const formattedData = response.data[0].rows.map((row, index) => {
            console.log(`Row ${index}:`, row); 
          
            return {
              date: row.dimensions[0], 
              newUsers: parseInt(row.metrics[2], 10) || 0,  //  Convert string to number
              activeUsers: parseInt(row.metrics[0], 10) || 0, //  Convert string to number
              keyEvents: parseInt(row.metrics[1],10) || 0 ,
              userEngagementDuration: parseInt(row.metrics[3],10) || 0,
            };
          })//  Sort by the last two characters (day part) of the date
          .sort((a, b) => parseInt(a.date.slice(-2)) - parseInt(b.date.slice(-2)));
  
        console.log("Formatted Data:", formattedData); //  Debug formatted output
  
        setChartData(formattedData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data");
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);


  const ActiveUsers = {
    chart: {
      type: "spline",
      height: 150,
    },
    title: {
      text: "Active Users",
    },
    xAxis: {
      categories: chartData.map((entry) => entry.date[4]+entry.date[5]+'-'+entry.date[6]+entry.date[7]),
      visible: false,
    },
    yAxis: {
      title: {
        text: "Number of Users",
      },
      visible: false,
    },
    series: [
      {
        name: "Active Users",
        data: chartData.map((entry) => entry.activeUsers),
        marker: { enabled: false },
        color: "#01579B",
      },
    ],
  };

  const UserEngage = {
    chart: {
      type: "spline",
      height: 150,
    },
    title: {
      text: "Average Engagement",
    },
    xAxis: {
      categories: chartData.map((entry) => entry.date.slice(4, 6) + '-' + entry.date.slice(6, 8)), 
      visible: false,
    },
    yAxis: {
      title: { text: "Average Engagement (seconds)" },
      visible: false,
      labels: {
        formatter: function () {
          return Math.round(this.value) + "s"; 
        },
      },
    },
    tooltip: {
      pointFormatter: function () {
        return `<span style="color:${this.color}">\u25CF</span> ${this.series.name}: <b>${Math.round(this.y)}s</b><br/>`;
      },
    },
    series: [
      {
        name: "Average Engagement Per User",
        data: chartData.map((entry) => Math.round(entry.userEngagementDuration / 60)), 
        marker: { enabled: false },
        color: "#29B6F6",
      },
    ],
  };
  const KeyEvents = {
    chart: {
      type: "spline",
      height: 150,
    },
    title: {
      text: "Key Events",
    },
    xAxis: {
      categories: chartData.map((entry) => entry.date[4]+entry.date[5]+'-'+entry.date[6]+entry.date[7]),
      visible: false,
    },
    yAxis: {
      title: {
        text: "Number of Events",
      },
      visible: false,
    },
    series: [
      {
        name: "Key Events",
        data: chartData.map((entry) => entry.keyEvents),
        marker: { enabled: false },
        color: "#1976D2",
      },
    ],
  };

  const NewUsers = {
    chart: {
      type: "spline",
      height: 150,
    },
    title: {
      text: "New Users",
    },
    xAxis: {
      categories: chartData.map((entry) => entry.date[4]+entry.date[5]+'-'+entry.date[6]+entry.date[7]),
      visible: false,
    },
    yAxis: {
      title: {
        text: "Number of Users",
      },
      visible: false,
    },
    series: [
      {
        name: "New Users",
        data: chartData.map((entry) => entry.newUsers),
        marker: { enabled: false },
        color: "#43A047",
      },
    ],
  };

  
  const NewVsActive = {
    chart: {
      type: "spline",
    },
    title: {
      text: "New Users vs Active Users",
    },
    xAxis: {
      categories: chartData.map((entry) => entry.date[4]+entry.date[5]+'-'+entry.date[6]+entry.date[7]),
      title: {
        text: "Date",
      },
    },
    yAxis: {
      title: {
        text: "Number of Users",
      },
    },
    tooltip: {
        shared: true,
        crosshairs: true,
    },
    series: [
      {
        name: "New Users",
        data: chartData.map((entry) => entry.newUsers),
        color: "#03A9F4",
      },
      {
        name: "Active Users",
        data: chartData.map((entry) => entry.activeUsers),
        color: "#01579B",
      },
    ],
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  return (
    <>
            {/* Highcharts component */}
            <Grid size={{ xs: 5, sm: 6, lg: 3 }}>
              <Card variant="outlined" sx={{ maxHeight: '200px', height: '100%', flexGrow: 1 , width: '100%'}}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Last 7 days
                </Typography>
                <HighchartsReact highcharts={Highcharts} options={NewUsers} />
              </Card>
            </Grid>
            <Grid size={{ xs: 5, sm: 6, lg: 3 }}>
              <Card variant="outlined" sx={{ maxHeight: '200px', height: '100%', flexGrow: 1 , width: '100%'}}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Last 7 days
                </Typography>
                <HighchartsReact highcharts={Highcharts} options={ActiveUsers} />
              </Card>
            </Grid>
            <Grid size={{ xs: 5, sm: 6, lg: 3 }}>
              <Card variant="outlined" sx={{ maxHeight: '200px', height: '100%', flexGrow: 1 , width: '100%'}}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Last 7 days
                </Typography>
                <HighchartsReact highcharts={Highcharts} options={KeyEvents} />
              </Card>
            </Grid>
            <Grid size={{ xs: 5, sm: 6, lg: 3 }}>
              <Card variant="outlined" sx={{ maxHeight: '200px', height: '100%', flexGrow: 1 , width: '100%'}}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Last 7 days
                </Typography>
                <HighchartsReact highcharts={Highcharts} options={UserEngage} />
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 6}}>
                <Card variant="outlined" sx={{width: '100%'}}>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Last 7 days
                </Typography>
                <HighchartsReact highcharts={Highcharts} options={NewVsActive} />
                </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <HighlightedCard />
            </Grid>
            
    </>
    );
};

export default DashboardTables;
