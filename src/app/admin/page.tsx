'use client';
import { useState } from 'react';
import { Box, Tab, Tabs, Container } from '@mui/material';
import ArticlesTab from '@/components/Admin/ArticlesTab';
import Typography from '@mui/material/Typography';


const AdminPage = () => {
    const [selectedTab, setSelectedTab] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setSelectedTab(newValue);
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ width: '100%' }}>
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
              <b>Administration</b>
            </Typography>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={selectedTab} onChange={handleChange} aria-label="admin tabs">
                        <Tab label="Articles" />
                    </Tabs>
                </Box>
                {selectedTab === 0 && <ArticlesTab />}
            </Box>
        </Container>
    );
};

export default AdminPage;
