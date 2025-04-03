import * as React from 'react';
import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Copyright from '../internals/components/Copyright';
import axios from 'axios';

export default function ReportGrid() {
  const [pageReports, setPageReports] = useState([]);
  const [videoReports, setVideoReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const videoTitles = [
      "Delivering Service Excellence",
      "Omni Fulfillment",
      "Safe and Sound Risk Mitigation",
      "Customer Engagement"
    ];

    const pageTitles = [
      "Customer Acquisition",
      "Connects Customer Engagement - ARGO Data",
      "Customer Experience - ARGO Data",
      "Connects Omni Fulfillment - ARGO Data"
    ];

    const start = "365daysAgo";
    const end = "yesterday";

    const fetchData = async () => {
      const pageReportsTemp = [];
      const videoReportsTemp = [];

      for (let i = 0; i < videoTitles.length; i++) {
        const videoTitle = videoTitles[i].trim();
        const pageTitle = pageTitles[i].trim();

        try {
          const res = await axios.get("http://localhost:5000/api/dynamic-report", {
            params: { videoTitle, pageTitle, start, end }
          });

          if (res.data?.length > 0) {
            const [pageData, videoData] = res.data;

            if (pageData?.rows?.length) {
              pageReportsTemp.push({ title: pageTitle, data: pageData });
            }

            if (videoData?.rows?.length) {
              videoReportsTemp.push({ title: videoTitle, data: videoData });
            }
          }
        } catch (err) {
          console.error(`Error fetching pair ${i + 1}:`, err.message);
        }
      }

      // Sort Page Reports
      pageReportsTemp.forEach(report => {
        report.data.rows.sort((a, b) => {
          const yearA = parseInt(a.dimensions[1]);
          const monthA = parseInt(a.dimensions[0]);
          const yearB = parseInt(b.dimensions[1]);
          const monthB = parseInt(b.dimensions[0]);
          return new Date(yearA, monthA - 1) - new Date(yearB, monthB - 1);
        });
      });

      // Sort Video Reports
      videoReportsTemp.forEach(report => {
        report.data.rows.sort((a, b) => {
          const percentA = Number(a.dimensions?.[1] ?? '0');
          const percentB = Number(b.dimensions?.[1] ?? '0');
          return percentA - percentB;
        });
      });

      setPageReports(pageReportsTemp);
      setVideoReports(videoReportsTemp);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <Typography>Loading reports...</Typography>;

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        page Reports
      </Typography>

      <Grid container spacing={2} columns={12}>
        {pageReports.map((report, index) => (
          <Grid item xs={12} key={index}>
            <Typography variant="subtitle1">{report.title}</Typography>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Month</TableCell>
                    <TableCell>Year</TableCell>
                    <TableCell>Page Title</TableCell>
                    <TableCell>Engagement Rate</TableCell>
                    <TableCell>User Engagement Duration</TableCell>
                    <TableCell>New Users</TableCell>
                    <TableCell>Total Users</TableCell>
                    <TableCell>Screen Page Views</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {report.data.rows.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell>{row.dimensions[0]}</TableCell>
                      <TableCell>{row.dimensions[1]}</TableCell>
                      <TableCell>{row.dimensions[2]}</TableCell>
                      <TableCell>{row.metrics[0]}</TableCell>
                      <TableCell>{row.metrics[1]}</TableCell>
                      <TableCell>{row.metrics[2]}</TableCell>
                      <TableCell>{row.metrics[3]}</TableCell>
                      <TableCell>{row.metrics[4]}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        ))}
      </Grid>
      
      
      <Typography component="h2" variant="h6" sx={{ mt: 4, mb: 2 }}>
        Video Reports
      </Typography>
      <Grid container spacing={2} columns={12}>
        {videoReports.map((report, index) => (
          <Grid item xs={12} key={index}>
            <Typography variant="subtitle1">{report.title}</Typography>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Video Percent</TableCell>
                    <TableCell>Event Count</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {report.data.rows.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell>{row.dimensions[1]}%</TableCell>
                      <TableCell>{row.metrics[0]}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        ))}
      </Grid>

      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}
