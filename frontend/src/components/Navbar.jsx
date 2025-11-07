import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Box,
  Container,
  useScrollTrigger,
  Slide,
  Menu,
  MenuItem,
} from '@mui/material';
import { ShoppingCart, SportsBasketball, Menu as MenuIcon } from '@mui/icons-material';
import AccountCircle from '@mui/icons-material/AccountCircle'

function HideOnScroll({ children }) {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [customer, setCustomer] = useState(null)
  const [cartCount, setCartCount] = useState(0)

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  React.useEffect(()=>{
    try { const c = JSON.parse(localStorage.getItem('customer')); setCustomer(c || null) } catch { setCustomer(null) }
  }, [])

  React.useEffect(()=>{
    if (!customer) { setCartCount(0); return }
    // fetch cart to get count
    fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'}/carts/${customer.customer_id}`)
      .then(r=>r.json()).then(data=> setCartCount((data.items||[]).length)).catch(()=>{})
  }, [customer])

  const navButtonVariants = {
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.2,
        type: "tween"
      }
    },
    tap: {
      scale: 0.95
    }
  };

  const logoVariants = {
    hover: {
      rotate: [0, -10, 10, -10, 0],
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <HideOnScroll>
      <AppBar 
        position="sticky" 
        sx={{ 
          backgroundColor: 'rgba(26, 35, 126, 0.95)',
          backdropFilter: 'blur(8px)'
        }}
      >
        <Container>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer' 
                }} 
                onClick={() => navigate('/')}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <motion.div
                  variants={logoVariants}
                  animate={isHovered ? "hover" : "initial"}
                >
                  <SportsBasketball sx={{ mr: 1 }} />
                </motion.div>
                <Typography 
                  variant="h6" 
                  component={motion.div}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  SportsShop
                </Typography>
              </Box>
            </motion.div>

            {/* Desktop Menu */}
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              {['/', '/products', '/about'].map((path) => (
                <motion.div
                  key={path}
                  variants={navButtonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Button
                    color="inherit"
                    component={Link}
                    to={path}
                    sx={{
                      mx: 1,
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        width: location.pathname === path ? '100%' : '0%',
                        height: '2px',
                        bottom: 0,
                        left: 0,
                        backgroundColor: 'white',
                        transition: 'width 0.3s ease'
                      },
                      '&:hover::after': {
                        width: '100%'
                      }
                    }}
                  >
                    {path === '/' ? 'Home' : path.slice(1).charAt(0).toUpperCase() + path.slice(2)}
                  </Button>
                </motion.div>
              ))}
              <motion.div
                variants={navButtonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <IconButton 
                  color="inherit" 
                  component={Link} 
                  to="/cart"
                  sx={{ ml: 1 }}
                >
                  <Badge badgeContent={cartCount} color="error">
                    <ShoppingCart />
                  </Badge>
                </IconButton>
              </motion.div>
              <motion.div variants={navButtonVariants} whileHover="hover" whileTap="tap">
                <IconButton color="inherit" component={Link} to="/profile" sx={{ ml: 1 }}>
                  <AccountCircle />
                </IconButton>
              </motion.div>
            </Box>

            {/* Sign in / user area */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1, ml: 2 }}>
              {customer ? (
                <>
                  <Button color="inherit" component={Link} to="/profile">Hi, {customer.name}</Button>
                  <Button color="inherit" onClick={() => { localStorage.removeItem('customer'); setCustomer(null); window.location.reload() }}>Sign out</Button>
                </>
              ) : (
                <Button color="inherit" component={Link} to="/auth">Sign in</Button>
              )}
            </Box>

            {/* Mobile Menu */}
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton color="inherit" onClick={handleMenuClick}>
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                {['Home', 'Products', 'About', 'Cart'].map((item) => (
                  <MenuItem 
                    key={item}
                    onClick={() => {
                      handleMenuClose();
                      navigate(item === 'Home' ? '/' : `/${item.toLowerCase()}`);
                    }}
                    component={motion.div}
                    whileHover={{ scale: 1.05, x: 10 }}
                  >
                    {item}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </HideOnScroll>
  );
};

export default Navbar;