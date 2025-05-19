
import React, { useState } from 'react';
import { Paper, Button, Typography, Switch, FormControlLabel, Stack, Box, Divider, CircularProgress, Slider } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';


const FileInput = ({ onChange, label, id, isLoading, accept = ".glb,.gltf" }) => {
  const [isDragging, setIsDragging] = useState(false);

  const commonFileHandler = (files) => {
    if (!isLoading && files && files.length > 0) {
  
      const syntheticEvent = {
        target: {
          files: files,
          id: id 
        }
      };
      onChange(syntheticEvent);
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
  
    if (e.currentTarget.contains(e.relatedTarget)) {
        return;
    }
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation(); 
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    commonFileHandler(e.dataTransfer.files);
    if (e.dataTransfer.items) {
      e.dataTransfer.items.clear();
    } else {
      e.dataTransfer.clearData();
    }
  };

  const handleInputChange = (e) => {
    commonFileHandler(e.target.files);
  };

  const displayLabel = `${label} (.glb recommended)`;
  const dropZoneActiveStyles = {
    borderColor: 'primary.main',
    backgroundColor: 'action.hover',
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        mb: 1,
        p: '16px', 
        border: '2px dashed',
        borderColor: isDragging ? 'primary.main' : 'grey.400',
        borderRadius: 1,
        transition: 'border-color 0.2s ease-in-out, background-color 0.2s ease-in-out',
        backgroundColor: isDragging ? 'action.hover' : 'transparent',
        cursor: isLoading ? 'default' : 'pointer',
        opacity: isLoading ? 0.7 : 1,
        textAlign: 'center', 
      }}
      onDrop={isLoading ? undefined : handleDrop}
      onDragOver={isLoading ? undefined : handleDragOver}
      onDragEnter={isLoading ? undefined : handleDragEnter}
      onDragLeave={isLoading ? undefined : handleDragLeave}
      
      onClick={() => !isLoading && document.getElementById(id)?.click()}
    >
      <CloudUploadIcon sx={{ fontSize: 40, color: isDragging ? 'primary.main' : 'grey.600', mb: 1 }} />
      <Typography variant="body1" sx={{ color: isDragging ? 'primary.main' : 'text.secondary', mb: 1 }}>
        Drag & Drop or Click to {label}
      </Typography>
      <Typography variant="caption" sx={{ color: 'text.disabled' }}>
        (.glb recommended)
      </Typography>
      <input
        type="file"
        hidden
        accept={accept}
        onChange={handleInputChange} 
        id={id}
        disabled={isLoading}
      />
      {isLoading && (
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <CircularProgress size={24} sx={{ mr: 1 }} />
          <Typography variant="caption">Loading...</Typography>
        </Box>
      )}
     
    </Box>
  );
};



export default function ControlPanel({
  onAvatarUpload,
  onClothingUpload,
  isClothingVisible,
  onToggleClothingVisibility,
  onResetScene,
  clothingColor,
  onColorChange,
  isLoadingAvatar,
  isLoadingClothing,
  clothingOffsetY,
  onClothingOffsetYChange,
  clothingScale,
  onClothingScaleChange,
  isClothingLoaded,
}) {

  const handleColorInputChange = (event) => {
    onColorChange(event.target.value);
  };

  const handleOffsetYSliderChange = (event, newValue) => {
    onClothingOffsetYChange(newValue);
  };

  const handleScaleSliderChange = (event, newValue) => {
    onClothingScaleChange(newValue);
  };

  const adjustmentControlsDisabled = isLoadingAvatar || isLoadingClothing || !isClothingLoaded;

  return (
    <Paper elevation={3} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
        Controls
      </Typography>
      <Divider sx={{ my: 1 }} />
      <Stack spacing={1} sx={{ flexGrow: 1, overflowY: 'auto', p: 0.5 }}> 
        <FileInput
          label="Upload Avatar" id="avatar-upload" onChange={onAvatarUpload}
          isLoading={isLoadingAvatar} accept=".glb,.gltf"
        />
        <FileInput
          label="Upload Clothing" id="clothing-upload" onChange={onClothingUpload}
          isLoading={isLoadingClothing} accept=".glb,.gltf"
        />
        <Divider sx={{ my: 1 }} />
        <FormControlLabel
          control={<Switch checked={isClothingVisible} onChange={onToggleClothingVisibility} disabled={!isClothingLoaded || isLoadingClothing || isLoadingAvatar} />}
          label="Toggle Clothing Visibility"
          sx={{ justifyContent: 'space-between', ml: 0, pr: 1 }}
        />
        <Divider sx={{ my: 1 }} />
        <Box>
          <Typography variant="subtitle1" gutterBottom>Garment Color</Typography>
          <input
            type="color" value={clothingColor} onChange={handleColorInputChange}
            style={{ width: '100%', height: '40px', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', padding: '0 4px' }}
            title="Select garment color"
            disabled={adjustmentControlsDisabled || !isClothingVisible}
          />
        </Box>

        <Divider sx={{ my: 1 }} />
        <Typography variant="subtitle1" gutterBottom sx={{ opacity: adjustmentControlsDisabled ? 0.5 : 1 }}>
            Clothing Adjustments
        </Typography>
        <Box sx={{ opacity: adjustmentControlsDisabled ? 0.5 : 1, pointerEvents: adjustmentControlsDisabled ? 'none' : 'auto' }}>
            <Typography id="offset-y-slider" gutterBottom variant="body2">
                Vertical Offset (Y): {typeof clothingOffsetY === 'number' ? clothingOffsetY.toFixed(2) : 'N/A'}
            </Typography>
            <Slider
                aria-labelledby="offset-y-slider"
                value={typeof clothingOffsetY === 'number' ? clothingOffsetY : 0}
                onChange={handleOffsetYSliderChange}
                min={-2}
                max={2}
                step={0.01}
                disabled={adjustmentControlsDisabled}
                size="small"
            />
            <Typography id="scale-slider" gutterBottom variant="body2" sx={{mt:1}}>
                Scale: {typeof clothingScale === 'number' ? clothingScale.toFixed(2) : 'N/A'}
            </Typography>
            <Slider
                aria-labelledby="scale-slider"
                value={typeof clothingScale === 'number' ? clothingScale : 1}
                onChange={handleScaleSliderChange}
                min={0.1}
                max={3}
                step={0.01}
                disabled={adjustmentControlsDisabled}
                size="small"
            />
        </Box>
      </Stack>
      <Divider sx={{ mt: 2, mb: 1 }} />
      <Button variant="outlined" color="error" onClick={onResetScene} sx={{ mt: 'auto' }}
        disabled={isLoadingClothing || isLoadingAvatar}
      >
        Reset Scene
      </Button>
    </Paper>
  );
}