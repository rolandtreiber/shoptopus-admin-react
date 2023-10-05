import {useEffect, useState} from 'react';
import {Card, CardContent, Typography} from '@material-ui/core';
// import {Trash as TrashIcon} from '../../icons/trash';
import {
  KeyboardSensor,
  PointerSensor,
  useSensor, useSensors,
} from '@dnd-kit/core';
import {
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import {FileDropzone} from "./file-dropzone";

export const PaidFileUploader = ({title, data, setData, multiple = true, max = null, types = ['images']}) => {
  const [showDropZone, setShowDropZone] = useState()
  const [activeId, setActiveId] = useState(null);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
      setData(() => {
        return {
          fileName: newFiles[0].name,
          objectUrl: URL.createObjectURL(newFiles[0])
        }
      });
    }
  };

  useEffect(() => {
    if ((multiple === true && max !== null && max <= data.length) || (multiple === false && data)) {
      // setShowDropZone(false)
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
            sx={{mb: 1.25}}
            variant="subtitle2"
          >
            {title}
          </Typography>
              {showDropZone && <FileDropzone
                onDrop={handleDrop}
                sx={{height: '100%'}}
              />}
          <h1>{JSON.stringify(data)}</h1>
        </CardContent>
      </Card>
    </>
  );
};
