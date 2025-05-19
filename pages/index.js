import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { Box, Grid, Typography, CircularProgress } from '@mui/material';
import ControlPanel from '../components/ControlPanel'; 
import dynamic from 'next/dynamic';

const ThreeScene = dynamic(() => import('../components/ThreeScene'), { 
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

  // State for clothing adjustments

  const [clothingOffset, setClothingOffset] = useState([0, INITIAL_CLOTHING_OFFSET_Y, 0]);
  const [clothingScale, setClothingScale] = useState(INITIAL_CLOTHING_SCALE);

  // Object URLs for cleanup
  const [avatarObjectUrl, setAvatarObjectUrl] = useState(null);
  const [clothingObjectUrl, setClothingObjectUrl] = useState(null);

  const threeSceneRef = useRef(); 

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
      // Reset adjustments when new clothing is loaded for a fresh start
      setClothingOffset([0, INITIAL_CLOTHING_OFFSET_Y, 0]);
      setClothingScale(INITIAL_CLOTHING_SCALE);
    }
  };

  const toggleClothingVisibility = () => {
    setIsClothingVisible(!isClothingVisible);
  };

  const handleResetScene = () => {
    if (avatarObjectUrl) {
      URL.revokeObjectURL(avatarObjectUrl);
      setAvatarObjectUrl(null);
    }
    if (clothingObjectUrl) {
      URL.revokeObjectURL(clothingObjectUrl);
      setClothingObjectUrl(null);
    }

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

  // Handlers for clothing adjustment changes
  const handleClothingOffsetYChange = (newY) => {
    // Update only the Y component of the offset
    setClothingOffset(prevOffset => [prevOffset[0], newY, prevOffset[2]]);
  };

  const handleClothingScaleChange = (newScale) => {
    setClothingScale(newScale);
  };

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (avatarObjectUrl) URL.revokeObjectURL(avatarObjectUrl);
      if (clothingObjectUrl) URL.revokeObjectURL(clothingObjectUrl);
    };
  }, [avatarObjectUrl, clothingObjectUrl]);

  return (
    <>
      <Head>
        <title>3D Avatar Customizer</title>
        <meta name="description" content="Upload and view 3D avatars and clothing" />
      </Head>
      <Box sx={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
        <Typography variant="h4" component="h1" sx={{ textAlign: 'center', py: 2, backgroundColor: 'primary.main', color: 'white' }}>
          3D Avatar Customizer
        </Typography>
        <Grid container sx={{ flexGrow: 1, overflow: 'hidden' }}>
          <Grid item xs={12} md={3} sx={{ height: { xs: 'auto', md: '100%' }, display: 'flex', flexDirection: 'column' }}>
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
          <Grid item xs={12} md={9} sx={{ position: 'relative', height: { xs: '70vh', md: 'calc(100% - 64px)' } }}> 
            {(isLoadingAvatar || isLoadingClothing) && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 10,
                  color: 'white',
                }}
              >
                <CircularProgress color="inherit" />
                <Typography sx={{ mt: 2 }}>
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