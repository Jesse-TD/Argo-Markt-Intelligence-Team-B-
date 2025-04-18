import * as React from 'react';
import { useState, useEffect } from 'react';
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
  // Initialize states from localStorage or default to true
  const [isAssistantOpen, setIsAssistantOpen] = useState(() => {
    const saved = localStorage.getItem('analyticsAssistant.isOpen');
    return saved !== null ? JSON.parse(saved) : true;
  });
  
  const [isAssistantExpanded, setIsAssistantExpanded] = useState(() => {
    const saved = localStorage.getItem('analyticsAssistant.isExpanded');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Sync with localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const savedOpen = localStorage.getItem('analyticsAssistant.isOpen');
      const savedExpanded = localStorage.getItem('analyticsAssistant.isExpanded');
      if (savedOpen !== null) {
        setIsAssistantOpen(JSON.parse(savedOpen));
      }
      if (savedExpanded !== null) {
        setIsAssistantExpanded(JSON.parse(savedExpanded));
      }
    };

    // Listen for storage changes from other components
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleAssistantStateChange = (isOpen, isExpanded) => {
    setIsAssistantOpen(isOpen);
    setIsAssistantExpanded(isExpanded);
  };

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
            transition: 'padding-right 0.3s ease-in-out',
            paddingRight: isAssistantOpen && isAssistantExpanded ? '480px' : '0px',
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

        {/* Collapsible Chat Panel */}
        <LLMChatPanel
          onStateChange={handleAssistantStateChange}
          defaultOpen={isAssistantOpen}
          defaultExpanded={isAssistantExpanded}
        />
      </Box>
    </AppTheme>
  );
}
