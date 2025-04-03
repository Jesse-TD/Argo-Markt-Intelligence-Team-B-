import * as React from 'react';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Copyright from '../internals/components/Copyright';
import DashboardTables from './DashboardTables';
import FetchVideoPagePairs from './FetchVideoPagePairs';


export default function ReportGrid() {
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      {/* cards */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Aquisition
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        <DashboardTables/>
        
      </Grid>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Engagement
      </Typography>
      <FetchVideoPagePairs />
      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}