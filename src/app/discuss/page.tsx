import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function Home() {
  return (
    <Container maxWidth="lg">
      <Typography 
        variant="h1" 
        gutterBottom 
        sx={{ 
          display: 'flex', 
          fontSize: {
            xs: '2.5rem',
            sm: '3.5rem',
            md: '4.5rem',
            lg: '6rem',
          },
          wordBreak: 'break-word', 
          overflowWrap: 'break-word',
        }}
      >
        <b>Θέματα</b>
      </Typography>
    </Container>
  );
}