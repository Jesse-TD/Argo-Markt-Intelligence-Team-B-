import * as React from 'react';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

export default function SelectContent({ isExpanded = true }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {isExpanded && (
        <Box
          component="img"
          src="/Type=App.svg"
          alt="ARGO"
          sx={{
            width: '80px',
            height: 'auto',
            display: 'block',
            ml: 2,
          }}
        />
      )}
    </Box>
  );
}
