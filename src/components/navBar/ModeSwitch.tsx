'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import { useColorScheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Dark mode
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Light mode
import Brightness5Icon from '@mui/icons-material/Brightness5'; // System mode

export default function ModeSwitch(props: { sx?: object }) {
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleModeChange = () => {
    if (mode === 'light') {
      setMode('dark');
    } else if (mode === 'dark') {
      setMode('system');
    } else {
      setMode('light');
    }
  };

  let icon;
  if (mode === 'light') {
    icon = <Brightness7Icon />;
  } else if (mode === 'dark') {
    icon = <Brightness4Icon />;
  } else {
    icon = <Brightness5Icon />;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        ...props.sx,
      }}
    >
      <IconButton onClick={handleModeChange} color="inherit">
        {icon}
      </IconButton>
    </Box>
  );
}
