import * as React from 'react';
import Stack from '@mui/material/Stack';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import NavbarBreadcrumbs from './NavbarBreadcrumbs';
import MenuButton from './MenuButton';
import ColorModeIconDropdown from '../../shared-theme/ColorModeIconDropdown';
import SideMenu from './SideMenu';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import { Tooltip, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import Search from './Search';

// this is the header component/ the div on the top of the app 
// uses the breadcrumbs, search bar, date picker, notification icon(does nothing), and the light/dark theme 

export default function Header() {
  const [open, setOpen] = React.useState(false);
  const location = useLocation();
  
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Home';
      case '/reports':
        return 'Reports';
      case '/data-insights':
        return 'Saved Insights';
      default:
        return 'Home';
    }
  };

  const toggleDrawer = (newOpen) => {
    setOpen(newOpen);
  };

  return (
    <Stack
      direction="row"
      sx={{
        display: { xs: 'none', md: 'flex' },
        width: '100%',
        alignItems: { xs: 'flex-start', md: 'center' },
        justifyContent: 'space-between',
        maxWidth: { sm: '100%', md: '1700px' },
        pt: 4,
      }}
      spacing={2}
    >
      <Stack direction="row" sx={{gap: 5, alignItems:'center'}}>
        <Typography variant="h2" sx={{ color: '#01579B', fontWeight: 'bold', fontSize: '3rem' }}>
          {getPageTitle()}
        </Typography>
      </Stack>
    </Stack>
  );
}
