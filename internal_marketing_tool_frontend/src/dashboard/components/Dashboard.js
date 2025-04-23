import * as React from 'react';
import Box from '@mui/material/Box';
import DashboardContent from './DashboardContent';
import { usePrefetch } from '../hooks/usePrefetch';

export default function Dashboard() {
  // Prefetch data as soon as dashboard loads
  usePrefetch();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <DashboardContent />
    </Box>
  );
} 