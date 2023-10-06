import {useEffect, useState} from 'react';
import {Card, CardContent, Typography} from '@material-ui/core';
import {FileDropzone} from "./file-dropzone";
import {useNestedValidation} from "../../../hooks/use-nested-validation";

export const PaidFileUploader = ({title, data, setData}) => {
  const [showDropZone, setShowDropZone] = useState()
  const {setValidation, isValid} = useNestedValidation()
  const [name, setName] = useState()
  const [description, setDescription] = useState()

  const handleDrop = (newFiles) => {
      setData(() => {
        return {
          fileName: newFiles[0].name,
          objectUrl: URL.createObjectURL(newFiles[0])
        }
      });
  };

  useEffect(() => {
    setShowDropZone(true)
  }, [data])

  return (
    <>
      <Card variant="outlined">
        <CardContent>
          <Typography
            color="textPrimary"
            sx={{mb: 1.25}}
            variant="subtitle2"
          >
            {title}
          </Typography>
          {showDropZone && <FileDropzone
            onDrop={handleDrop}
            sx={{height: '100%'}}
          />}
        </CardContent>
      </Card>
    </>
  );
};
