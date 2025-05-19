import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { Box, Grid, Typography, CircularProgress, useTheme, useMediaQuery } from '@mui/material'; // Added useTheme, useMediaQuery
import ControlPanel from '../components/ControlPanel'; // Adjust path if needed
import dynamic from 'next/dynamic';

const ThreeScene = dynamic(() => import('../components/ThreeScene'), { // Adjust path if needed
  ssr: false,
  loading: () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
      <CircularProgress />
      <Typography sx={{ ml: 2 }}>Loading 3D Scene...</Typography>
    </Box>
  ),
});

const INITIAL_CLOTHING_OFFSET_Y = 0;
const INITIAL_CLOTHING_SCALE = 1;

export default function HomePage() {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [clothingUrl, setClothingUrl] = useState(null);
  const [isClothingVisible, setIsClothingVisible] = useState(true);
  const [clothingColor, setClothingColor] = useState('#FFFFFF');
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(false);
  const [isLoadingClothing, setIsLoadingClothing] = useState(false);

  const [clothingOffset, setClothingOffset] = useState([0, INITIAL_CLOTHING_OFFSET_Y, 0]);
  const [clothingScale, setClothingScale] = useState(INITIAL_CLOTHING_SCALE);

  const [avatarObjectUrl, setAvatarObjectUrl] = useState(null);
  const [clothingObjectUrl, setClothingObjectUrl] = useState(null);

  const threeSceneRef = useRef();
  const theme = useTheme(); // For accessing theme properties like spacing
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Check if screen is below 'md'

  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (avatarObjectUrl) URL.revokeObjectURL(avatarObjectUrl);
      setIsLoadingAvatar(true);
      const newUrl = URL.createObjectURL(file);
      setAvatarObjectUrl(newUrl);
      setAvatarUrl(newUrl);
    }
  };

  const handleClothingUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (clothingObjectUrl) URL.revokeObjectURL(clothingObjectUrl);
      setIsLoadingClothing(true);
      const newUrl = URL.createObjectURL(file);
      setClothingObjectUrl(newUrl);
      setClothingUrl(newUrl);
      setClothingOffset([0, INITIAL_CLOTHING_OFFSET_Y, 0]);
      setClothingScale(INITIAL_CLOTHING_SCALE);
    }
  };

  const toggleClothingVisibility = () => {
    setIsClothingVisible(!isClothingVisible);
  };

  const handleResetScene = () => {
    if (avatarObjectUrl) URL.revokeObjectURL(avatarObjectUrl);
    if (clothingObjectUrl) URL.revokeObjectURL(clothingObjectUrl);
    setAvatarObjectUrl(null);
    setClothingObjectUrl(null);
    setAvatarUrl(null);
    setClothingUrl(null);
    setIsClothingVisible(true);
    setClothingColor('#FFFFFF');
    setIsLoadingAvatar(false);
    setIsLoadingClothing(false);
    setClothingOffset([0, INITIAL_CLOTHING_OFFSET_Y, 0]);
    setClothingScale(INITIAL_CLOTHING_SCALE);
  };

  const handleColorChange = (colorValue) => {
    setClothingColor(typeof colorValue === 'string' ? colorValue : colorValue.hex);
  };

  const handleClothingOffsetYChange = (newY) => {
    setClothingOffset(prevOffset => [prevOffset[0], newY, prevOffset[2]]);
  };

  const handleClothingScaleChange = (newScale) => {
    setClothingScale(newScale);
  };

  useEffect(() => {
    return () => {
      if (avatarObjectUrl) URL.revokeObjectURL(avatarObjectUrl);
      if (clothingObjectUrl) URL.revokeObjectURL(clothingObjectUrl);
    };
  }, [avatarObjectUrl, clothingObjectUrl]);

  // Calculate header height (approximate or get dynamically if it's variable)
  // For MUI Typography h4 with py: 2, it's roughly 32px (font) + 16px*2 (padding) = 64px
  const headerHeight = '64px';

  return (
    <>
      <Head>
        <title>3D Avatar Customizer</title>
        <meta name="description" content="Upload and view 3D avatars and clothing" />
        <meta name="viewport" content="width=device-width, initial-scale=1" /> {/* Essential for responsiveness */}
      </Head>
      <Box sx={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            textAlign: 'center',
            py: 2,
            backgroundColor: 'primary.main',
            color: 'white',
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' } // Responsive font size for header
          }}
        >
          3D Avatar Customizer
        </Typography>
        <Grid container sx={{
          flexGrow: 1,
          // On mobile, allow scrolling for the whole grid content if it overflows
          // On desktop, main grid container itself doesn't scroll, individual panels might
          overflow: isMobile ? 'auto' : 'hidden',
          height: `calc(100vh - ${headerHeight})` // Ensure grid takes remaining height
        }}>
          {/* Control Panel Grid Item */}
          <Grid
            item
            xs={12} // Full width on extra-small screens
            md={3}  // 3/12 width on medium screens and up
            sx={{
              height: { xs: 'auto', md: '100%' }, // Auto height on mobile, full height on desktop
              display: 'flex',
              flexDirection: 'column',
              borderRight: { xs: 'none', md: `1px solid ${theme.palette.divider}` }, // Divider for desktop
              borderBottom: { xs: `1px solid ${theme.palette.divider}`, md: 'none' }, // Divider for mobile
              p: { xs: 1, sm: 2}, // Less padding on very small screens
              overflowY: { xs: 'visible', md: 'auto' } // Allow control panel to scroll on desktop if content overflows
            }}
          >
            <ControlPanel
              onAvatarUpload={handleAvatarUpload}
              onClothingUpload={handleClothingUpload}
              isClothingVisible={isClothingVisible}
              onToggleClothingVisibility={toggleClothingVisibility}
              onResetScene={handleResetScene}
              clothingColor={clothingColor}
              onColorChange={handleColorChange}
              isLoadingAvatar={isLoadingAvatar}
              isLoadingClothing={isLoadingClothing}
              clothingOffsetY={clothingOffset[1]}
              onClothingOffsetYChange={handleClothingOffsetYChange}
              clothingScale={clothingScale}
              onClothingScaleChange={handleClothingScaleChange}
              isClothingLoaded={!!clothingUrl && !isLoadingClothing}
            />
          </Grid>

          {/* 3D Scene Grid Item */}
          <Grid
            item
            xs={12} // Full width on extra-small screens
            md={9}  // 9/12 width on medium screens and up
            sx={{
              position: 'relative',
              // Define a substantial height for mobile, full available height for desktop
              height: { xs: '70vh', md: '100%' },
              minHeight: { xs: '300px', sm: '400px' }, // Minimum height for the scene on mobile
            }}
          >
            {(isLoadingAvatar || isLoadingClothing) && (
              <Box
                sx={{
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
                  flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                  zIndex: 10, color: 'white',
                }}
              >
                <CircularProgress color="inherit" />
                <Typography sx={{ mt: 2 }}>
                  {/* Loading messages... */}
                  {isLoadingAvatar && !isLoadingClothing && "Loading Avatar..."}
                  {isLoadingClothing && !isLoadingAvatar && "Loading Clothing..."}
                  {isLoadingClothing && isLoadingAvatar && "Loading Avatar & Clothing..."}
                </Typography>
              </Box>
            )}
            <ThreeScene
              ref={threeSceneRef}
              avatarUrl={avatarUrl}
              clothingUrl={clothingUrl}
              isClothingVisible={isClothingVisible}
              clothingColor={clothingColor}
              onAvatarLoad={() => setIsLoadingAvatar(false)}
              onClothingLoad={() => setIsLoadingClothing(false)}
              clothingPositionOffset={clothingOffset}
              clothingScaleFactor={clothingScale}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}