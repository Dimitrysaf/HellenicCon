'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from 'next/link';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export default function NotFoundPage() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
        p: 4,
        bgcolor: 'background.default',
        color: 'text.primary',
        position: 'relative',
        overflow: 'hidden', 
      }}
    >
      <ErrorOutlineIcon
        sx={{
          position: 'absolute',
          fontSize: { xs: 400, sm: 500, md: 500 }, 
          color: 'text.primary',
          opacity: 0.1, 
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)', 
          pointerEvents: 'none', 
          zIndex: 0, 
        }}
      />

      <Box sx={{ zIndex: 1 }}>
        <Typography variant="h1" component="h1" gutterBottom>
          <b>404</b>
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom>
          Η σελίδα δεν βρέθηκε
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, maxWidth: 600 }}>
          Δεν μπορούμε να βρούμε τη σελίδα που ψάχνετε. <br />
          Ίσως η διεύθυνση URL να είναι λανθασμένη ή η σελίδα να έχει μετακινηθεί.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          href="/"
        >
          ΕΠΙΣΤΡΩΦΗ ΣΤΗΝ ΑΡΧΙΚΗ
        </Button>
      </Box>
    </Box>
  );
}
