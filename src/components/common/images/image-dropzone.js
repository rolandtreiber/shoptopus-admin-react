import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
import { Avatar, Box} from '@material-ui/core';
import {useTranslation} from "react-i18next";
import { Upload as UploadIcon } from '../../../icons/upload';
import TrButton from "../translated/translated-button";
import {TrTypography} from "../translated/translated-typography";

export const ImageDropzone = (props) => {
  const { accept, maxFiles, maxSize, minSize, onDrop, sx } = props;
  const { t } = useTranslation();
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: accept ? accept : ['image/png', 'image/jpg', 'image/jpeg'],
    maxFiles,
    maxSize,
    minSize,
    onDrop
  });

  return (
    <Box
      sx={{
        alignItems: 'center',
        borderColor: 'neutral.200',
        borderRadius: 1,
        borderStyle: 'dashed',
        borderWidth: 1,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
        justifyContent: 'center',
        outline: 'none',
        width: '100%',
        py: 2,
        ...(isDragActive && {
          borderColor: 'primary.main',
          backgroundColor: 'action.hover'
        }),
        '&:hover': {
          borderColor: 'primary.main',
          backgroundColor: 'action.hover'
        },
        ...sx
      }}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <Avatar
        sx={{
          backgroundColor: 'rgba(238, 240, 242, 1)',
          color: 'text.secondary',
          height: 36,
          width: 36
        }}
      >
        <UploadIcon />
      </Avatar>
      <TrButton
        color="primary"
        variant="text"
      >
        Upload
      </TrButton>
      <TrTypography
        align="center"
        sx={{ color: 'text.secondary' }}
        variant="caption"
      >
        {props.multiple === true ? "Select images" : "Select image"}
      </TrTypography>
    </Box>
  );
};

ImageDropzone.propTypes = {
  accept: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ]),
  maxFiles: PropTypes.number,
  maxSize: PropTypes.number,
  minSize: PropTypes.number,
  onDrop: PropTypes.func,
  sx: PropTypes.object
};
