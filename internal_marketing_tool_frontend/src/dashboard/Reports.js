import * as React from 'react';

import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppNavbar from './components/AppNavbar';
import Header from './components/Header';
import MainGrid from './components/MainGrid';
import SideMenu from './components/SideMenu';
import AppTheme from '../shared-theme/AppTheme';
import ReportGrid from './components/ReportGrid';
import LLMChatPanel from './components/LLMChatPanel';
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from './theme/customizations';

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

export default function Reports(props) {
  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex' }}>
        <SideMenu />
        <AppNavbar />

        {/* Reports section (scrollable content) */}
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
            height: '100vh', 
            overflowY: 'auto', 
            overflowX: 'hidden',
          })}
        >
          <Box
            sx={{
              px: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
              maxWidth: '100%',
            }}
          >
            <Header />
            <ReportGrid />
          </Box>
        </Box>

        {/* GPT Assistant panel (fixed sidebar style) */}
        <Box
          sx={{
            width: 360,
            height: '100vh',
            borderLeft: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
            position: 'sticky', 
            top: 0,
          }}
        >
          <LLMChatPanel />
        </Box>
      </Box>
    </AppTheme>
  );
}
