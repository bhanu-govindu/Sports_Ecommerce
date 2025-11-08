import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
} from '@mui/material';
import { 
  SportsBasketball, 
  SportsSoccer, 
  SportsTennis, 
  SportsVolleyball,
  KeyboardArrowDown
} from '@mui/icons-material';
import { HERO_BG, CATEGORIES } from '../assets/images';

const HomePage = () => {
  const navigate = useNavigate();
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const heroStyle = {
    minHeight: '100vh',
    // keep a slight brand tint but make it very transparent so the image shows through
    background: `linear-gradient(135deg, rgba(26, 35, 126, 0.18), rgba(0, 0, 0, 0.14)), url(${HERO_BG})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      // subtle warm overlay to mimic screenshot (very light)
      background: 'linear-gradient(45deg, rgba(255,140,0,0.08) 0%, rgba(26,35,126,0.08) 100%)',
      pointerEvents: 'none',
    }
  };

  const featuredSports = [
    { 
      icon: <SportsBasketball sx={{ fontSize: 40 }} />, 
      name: 'Basketball', 
      color: '#ff9800',
      bgImage: CATEGORIES.BASKETBALL
    },
    { 
      icon: <SportsSoccer sx={{ fontSize: 40 }} />, 
      name: 'Football', 
      color: '#4caf50',
      bgImage: CATEGORIES.FOOTBALL
    },
    { 
      icon: <SportsTennis sx={{ fontSize: 40 }} />, 
      name: 'Tennis', 
      color: '#2196f3',
      bgImage: CATEGORIES.TENNIS
    },
    { 
      icon: <SportsVolleyball sx={{ fontSize: 40 }} />, 
      name: 'Cricket', 
      color: '#f44336',
      bgImage: CATEGORIES.CRICKET
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box sx={heroStyle}>
        <Container>
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    color: '#ffffff',
                    fontWeight: 'bold',
                    mb: 2,
                    fontSize: { xs: '3rem', md: '4.5rem' },
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                  }}
                >
                  Your Ultimate
                  <br />
                  Sports Store
                </Typography>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    color: '#f0f0f0',
                    mb: 4,
                    maxWidth: 600,
                    textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                    letterSpacing: '0.3px',
                    lineHeight: 1.6,
                  }}
                >
                  Discover premium sports equipment for every athlete. From beginners to pros,
                  find everything you need to excel in your game.
                </Typography>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    color: '#1a237e',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.2rem',
                    '&:hover': {
                      backgroundColor: '#ffffff',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(255,255,255,0.25)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Shop Now
                </Button>
              </motion.div>
            </Grid>
          </Grid>
        </Container>

        {/* Scroll Indicator */}
        <motion.div
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          style={{
            position: 'absolute',
            bottom: 40,
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <IconButton sx={{ color: 'white' }}>
            <KeyboardArrowDown sx={{ fontSize: 40 }} />
          </IconButton>
        </motion.div>
      </Box>

      {/* Featured Sports Section */}
      <Box sx={{ py: 8, backgroundColor: '#f5f5f5' }}>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h3"
              sx={{
                textAlign: 'center',
                mb: 6,
                fontWeight: 'bold',
                color: '#1a237e',
              }}
            >
              Featured Sports
            </Typography>
          </motion.div>

          <Grid container spacing={4}>
            {featuredSports.map((sport, index) => (
              <Grid item xs={12} sm={6} md={3} key={sport.name}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <Card
                    onClick={() => navigate(`/products?sport=${encodeURIComponent(sport.name)}`)}
                    sx={{
                      height: '280px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `url(${sport.bgImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        transition: 'all 0.6s ease',
                        zIndex: 0,
                      },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `linear-gradient(rgba(255, 255, 255, 0.7), ${sport.color}30)`,
                        transition: 'all 0.6s ease',
                        zIndex: 1,
                      },
                      '&:hover': {
                        transform: 'translateY(-10px)',
                        '&::before': {
                          transform: 'scale(1.1)',
                        },
                        '&::after': {
                          background: `linear-gradient(rgba(255, 255, 255, 0.5), ${sport.color}50)`,
                        },
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%',
                        position: 'relative',
                        zIndex: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Box
                        sx={{
                          width: 90,
                          height: 90,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                          color: sport.color,
                          mb: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'rotate(360deg)',
                          }
                        }}
                      >
                        {sport.icon}
                      </Box>
                      <CardContent>
                        <Typography
                          variant="h5"
                          sx={{
                            textAlign: 'center',
                            fontWeight: 'bold',
                            color: '#1a237e',
                            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            letterSpacing: '0.5px',
                          }}
                        >
                          {sport.name}
                        </Typography>
                      </CardContent>
                    </Box>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;