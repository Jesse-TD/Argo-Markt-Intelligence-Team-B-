import * as React from 'react';
import LightModeIcon from '@mui/icons-material/LightModeRounded';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { useColorScheme } from '@mui/material/styles';

const ColorModeIconDropdown = React.forwardRef(function ColorModeIconDropdown(props, ref) {
  const { setMode } = useColorScheme();
  
  // Force light mode
  React.useEffect(() => {
    setMode('light');
  }, [setMode]);

  return (
    <IconButton
      data-screenshot="toggle-mode"
      size="small"
      disabled
      ref={ref}
      {...props}
    >
      <LightModeIcon />
    </IconButton>
  );
});

export default ColorModeIconDropdown;
