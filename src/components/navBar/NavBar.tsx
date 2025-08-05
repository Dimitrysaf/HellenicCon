'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import Icon from '../Icon';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useRouter } from 'next/navigation';

const drawerWidth = 240;

const pages = [
  { name: 'ΣΥΝΤΑΓΜΑ', path: '/', icon: <AccountBalanceIcon /> },
  { name: 'ΘΕΜΑΤΑ', path: '/discuss', icon: <ChatBubbleIcon /> },
];

export default function NavBar({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const router = useRouter();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    if (mobileOpen) {
      handleDrawerToggle();
    }
  };

  const navList = (
    <List>
      {pages.map((page) => (
        <ListItem key={page.name} disablePadding>
          <ListItemButton onClick={() => handleNavigation(page.path)}>
            <ListItemIcon>
              {page.icon}
            </ListItemIcon>
            <ListItemText primary={page.name} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2, display: { xs: 'flex', md: 'none' } }}
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
          <Icon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Icon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            ΤΟ ΣΥΝΤΑΓΜΑ ΤΗΣ ΕΛΛΑΔΟΣ
          </Typography>
        </Toolbar>
      </AppBar>
      {/* Permanent Drawer (Desktop) */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
          display: { xs: 'none', md: 'block' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          {navList}
        </Box>
      </Drawer>
      {/* Temporary Drawer (Mobile) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          {navList}
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: '64px' }}>
        {children}
      </Box>
    </Box>
  );
}