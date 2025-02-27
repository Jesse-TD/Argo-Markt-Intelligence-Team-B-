import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

const DataTable = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch data from the backend
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/report');  // Adjust the API endpoint if necessary
                setData(response.data);
                setLoading(false);
            }catch (err) {
                setError('Error fetching data');
                setLoading(false);
            }
        };
        fetchData();
    }, []);


    // If loading or error, display appropriate message
    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    // Format the month data to ensure it's in '01', '02', ..., '12' format
    const formattedData = data.map((item) => ({
        ...item,
        month: item.month.padStart(2, '0'),
    }));

    // Sort data by month to ensure it is in order from 01 to 12
    formattedData.sort((a, b) => a.month.localeCompare(b.month));

    const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const formattedMonthNames = formattedData.map((item) => {
        const monthIndex = parseInt(item.month, 10) - 1; 
        return monthNames[monthIndex];
    });



    // Highcharts configuration
    const chartOptions = {
        chart: {
            type: 'spline',
        },
        title: {
            text: 'Total vs new number of Users',
        },
        xAxis: {
            categories: formattedMonthNames,  // Sorted months as X-axis categories
            title: {
                text: 'Month',
            },
        },
        yAxis: {
            min: 0,
            title: {
            text: 'Number of Users',
            },
        },
        tooltip: {
            shared: true,
            crosshairs: true,
        },
        series: [
            {
            name: 'New Users',
            data: formattedData.map((item) => item.newUsers),
            },
            {
            name: 'Total Users',
            data: formattedData.map((item) => item.totalUsers),
            },
        ],
    };

    return (
    <Box sx ={{width: '100%', maxWidth: {sm: '100%', mb: '1700px'} }}>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>Overview</Typography>
        <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
        >
            {/* Highcharts component */}
            <Grid size={{ xs: 12, md: 6}}>
                <Card variant="outlined" sx={{width: '100%'}}>
                <HighchartsReact highcharts={Highcharts} options={chartOptions} />
                </Card>
            </Grid>

        </Grid>
    </Box>
    );
};

export default DataTable;
