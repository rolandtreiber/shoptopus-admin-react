import {useEffect, useState} from 'react';
import { Box, Card, CardContent, IconButton, Typography } from '@material-ui/core';
import { Trash as TrashIcon } from '../icons/trash';
import {ImageDropzone} from "./image-dropzone";

export const Uploader = ({title, data, setData, multiple = true, max = null, types = ['images']}) => {
  const [showDropZone, setShowDropZone] = useState()

  const handleDeleteImage = (image) => {
    if (multiple) {
      setData((prevfiles) => prevfiles
        .filter((selectedImage) => selectedImage !== image));
    } else {
      setData(null)
    }
  };

  const handleDrop = (newFiles) => {
    if (multiple) {
      setData((prevImages) => [...prevImages, ...newFiles.map(f => URL.createObjectURL(f))]);
    } else {
      setData(() => URL.createObjectURL(newFiles[0]));
    }
  };

  const renderImage = (image) => (
    <Box
      key={image}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Box
        sx={{
          alignItems: 'center',
          borderRadius: 1,
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          position: 'relative',
          '&::before': {
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: 1,
            bottom: 0,
            content: '""',
            display: 'none',
            left: 0,
            position: 'absolute',
            right: 0,
            top: 0
          },
          '&:hover': {
            boxShadow: (theme) => `0px 0px 0px 1px ${theme.palette.primary.main}`,
            '&::before': {
              display: 'block'
            },
            '& button': {
              display: 'inline-flex'
            }
          }
        }}
      >
        <img
          alt=""
          src={image}
        />
        <IconButton
          color="primary"
          onClick={() => handleDeleteImage(image)}
          sx={{
            bottom: 8,
            color: 'text.secondary',
            display: 'none',
            position: 'absolute',
            right: 8
          }}
        >
          <TrashIcon />
        </IconButton>
      </Box>
    </Box>
  )

  useEffect(() => {
      if ((multiple === true && max !== null && max <= data.length) || (multiple === false && data)) {
        setShowDropZone(false)
      } else {
        setShowDropZone(true)
      }
  }, [data])
  
  return (
    <>
      <Card variant="outlined">
        <CardContent>
          <Typography
            color="textPrimary"
            sx={{ mb: 1.25 }}
            variant="subtitle2"
          >
            {title}
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: ((multiple === true && (!data.length || (max === 1 && data.length === 1)))) || multiple === false ? '1fr' : ({
                md: 'repeat(auto-fill, 140px)',
                sm: 'repeat(4, 1fr)',
                xs: 'repeat(2, 1fr)'
              }),
              '& img': {
                borderRadius: 1,
                maxWidth: '100%'
              }
            }}
          >
            {showDropZone && <ImageDropzone
              onDrop={handleDrop}
              sx={{ height: '100%' }}
              accept="image/jpeg, image/png"
            />}
            {multiple === true ? data.map((image) =>
              renderImage(image)
            ) : renderImage(data)}
          </Box>
        </CardContent>
      </Card>
    </>
  );
};
