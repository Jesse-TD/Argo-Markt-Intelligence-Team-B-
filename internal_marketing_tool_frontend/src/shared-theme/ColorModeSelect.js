import * as React from 'react';
import { useColorScheme } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

export default function ColorModeSelect(props) {
  const { setMode } = useColorScheme();
  
  // Force light mode
  React.useEffect(() => {
    setMode('light');
  }, [setMode]);
  
  // Return disabled select with only light mode option
  return (
    <Select
      value="light"
      disabled
      SelectDisplayProps={{
        'data-screenshot': 'toggle-mode',
      }}
      {...props}
    >
      <MenuItem value="light">Light</MenuItem>
    </Select>
  );
}
