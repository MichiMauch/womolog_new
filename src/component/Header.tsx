import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Box, Drawer, Fab } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CombinedFilter from './CombinedFilter';

interface HeaderProps {
  countries: string[];
  onFilter: (startDate: Date | null, endDate: Date | null, country: string) => void;
  onReset: () => void;
}

const Header: React.FC<HeaderProps> = ({ countries, onFilter, onReset }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [fabPosition, setFabPosition] = useState<string | number>(16); // Typ geändert

  useEffect(() => {
    if (mobileOpen) {
      setFabPosition('calc(16px + 295px)'); // Adjust based on drawer height
    } else {
      setFabPosition(16);
    }
  }, [mobileOpen]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: 'black' }} className="header">
        <Toolbar sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '8px 0' }}>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', width: '100%', justifyContent: 'center', gap: '8px' }}>
            <CombinedFilter countries={countries} onFilter={onFilter} onReset={onReset} onClose={() => {}} />
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="bottom"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{ display: { xs: 'block', md: 'none' } }}
        transitionDuration={{ enter: 300, exit: 300 }} // Unified transition duration
      >
        <Box sx={{ p: 2, backgroundColor: 'black', color: 'white' }}>
          <CombinedFilter countries={countries} onFilter={onFilter} onReset={onReset} onClose={handleDrawerToggle} />
        </Box>
      </Drawer>
      <Fab
        color="inherit"
        aria-label="open drawer"
        onClick={handleDrawerToggle}
        sx={{
          display: { xs: 'flex', md: 'none' },
          position: 'fixed',
          bottom: 0, // Set bottom to 0 to align with the screen bottom
          transform: `translateY(${mobileOpen ? '-295px' : '0'})`, // Adjust based on drawer height
          right: 16,
          zIndex: 2000, // Ensure the fab stays above the drawer
          backgroundColor: 'black',
          borderRadius: '4px',
          width: 56,
          height: 56,
          transition: 'transform 0.3s', // Unified transition duration
        }}
      >
        <MenuIcon sx={{ color: 'white' }} />
      </Fab>
    </>
  );
};

export default Header;
