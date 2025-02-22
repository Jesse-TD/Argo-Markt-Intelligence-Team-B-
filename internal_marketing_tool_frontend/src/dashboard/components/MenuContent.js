import * as React from 'react';
import { useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';


const mainListItems = [
  { id:0, text: 'Home', icon: <HomeRoundedIcon /> },
  { id:1, text: 'Reports', icon: <AnalyticsRoundedIcon /> },
  { id:2, text: 'Clients', icon: <PeopleRoundedIcon /> },
  { id:3, text: 'Tasks', icon: <AssignmentRoundedIcon /> },
];

const secondaryListItems = [
  { id:4, text: 'Settings', icon: <SettingsRoundedIcon /> },
  { id:5, text: 'About', icon: <InfoRoundedIcon /> },
];


export default function MenuContent() {
  const [selectedIndex, setSelectedIndex] = useState();

  const handleItem = (props) => {
    setSelectedIndex(props);
  };

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {mainListItems.map(item => (
          <ListItem key={item.id} disablePadding sx={{ display: 'block' }}>
            <ListItemButton onClick={() => handleItem(item.id)} selected={selectedIndex === item.id}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List dense>
        {secondaryListItems.map(item => (
          <ListItem key={item.id} disablePadding sx={{ display: 'block' }}>
            <ListItemButton onClick={() => handleItem(item.id)} selected = {selectedIndex === item.id}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
