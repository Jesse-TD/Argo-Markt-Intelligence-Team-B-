import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';

const mainListItems = [
  { id: 0, text: 'Home', icon: <HomeRoundedIcon />, path: '/dashboard' },
  { id: 1, text: 'Reports', icon: <AnalyticsRoundedIcon />, path: '/reports' },
  { id: 2, text: 'Saved Insights', icon: <AutoAwesomeRoundedIcon />, path:'/data-insights' },
  { id: 3, text: 'Tasks', icon: <AssignmentRoundedIcon /> },
];

const secondaryListItems = [
  { id: 4, text: 'Settings', icon: <SettingsRoundedIcon /> },
  { id: 5, text: 'About', icon: <InfoRoundedIcon /> },
];

export default function MenuContent({ isExpanded = true }) {
  const [selectedIndex, setSelectedIndex] = useState();
  const navigate = useNavigate();

  const handleItem = (item) => {
    setSelectedIndex(item.id);
    if (item.path) navigate(item.path);
  };

  const MenuItem = ({ item }) => {
    const button = (
      <ListItemButton
        onClick={() => handleItem(item)}
        selected={selectedIndex === item.id}
        sx={{
          minHeight: 48,
          justifyContent: isExpanded ? 'initial' : 'center',
          px: 2.5,
          borderRadius: 1,
          '&.Mui-selected': {
            backgroundColor: 'rgba(1, 87, 155, 0.08)',
            '&:hover': {
              backgroundColor: 'rgba(1, 87, 155, 0.12)',
            }
          },
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          }
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: isExpanded ? 2 : 'auto',
            justifyContent: 'center',
            '& .MuiSvgIcon-root': {
              width: '24px',
              height: '24px',
              color: '#000000'
            }
          }}
        >
          {item.icon}
        </ListItemIcon>
        {isExpanded && (
          <ListItemText
            primary={item.text}
            sx={{
              opacity: isExpanded ? 1 : 0,
              '& .MuiTypography-root': {
                fontSize: '1.1rem',
                fontWeight: 500,
                fontFamily: 'Roboto, sans-serif',
                color: '#000000'
              }
            }}
          />
        )}
      </ListItemButton>
    );

    return (
      <ListItem
        disablePadding
        sx={{
          display: 'block',
          mb: 1
        }}
      >
        {isExpanded ? (
          button
        ) : (
          <Tooltip title={item.text} placement="right">
            {button}
          </Tooltip>
        )}
      </ListItem>
    );
  };

  return (
    <Stack sx={{ flexGrow: 1, p: 2, justifyContent: 'space-between' }}>
      <List>
        {mainListItems.map(item => (
          <MenuItem key={item.id} item={item} />
        ))}
      </List>
      <List>
        {secondaryListItems.map(item => (
          <MenuItem key={item.id} item={item} />
        ))}
      </List>
    </Stack>
  );
}

