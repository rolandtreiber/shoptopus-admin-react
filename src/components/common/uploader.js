import {useEffect, useState} from 'react';
import {Box, Card, CardContent, IconButton, Typography} from '@material-ui/core';
import {Trash as TrashIcon} from '../../icons/trash';
import {ImageDropzone} from "./images/image-dropzone";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor, useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import {SortableItem} from './sortable-item';

export const Uploader = ({title, data, setData, multiple = true, max = null, types = ['images']}) => {
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
      setData(() => URL.createObjectURL(newFiles[0]));
    }
  };

  const renderSingleImage = (image) => (
    <Box
      key={image}
      sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      {image && <Box
        sx={{alignItems: 'center', borderRadius: 1, display: 'flex', justifyContent: 'center',
          width: '100%', height: '100%', position: 'relative',
          '&::before': {
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: 1, bottom: 0, content: '""',
            display: 'none', left: 0, position: 'absolute', right: 0, top: 0
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
          style={{
            minWidth: 50,
            minHeight: 50
          }}
        />
        <IconButton
          color="primary"
          onClick={() => handleDeleteImage(image)}
          sx={{
            bottom: 8,
            color: 'text.secondary',
            position: 'absolute',
            display: 'none',
            right: 8,
          }}
        >
          <TrashIcon/>
        </IconButton>
      </Box>}
    </Box>
  )

  const renderSortableImage = (image) => (
    <Box
      key={image}
      sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <Box
        sx={{alignItems: 'center', borderRadius: 1, display: 'flex', justifyContent: 'center',
          width: '100%', height: '100%', position: 'relative',
          '&::before': {
            borderRadius: 1, bottom: 0, content: '""',
            display: 'none', left: 0, position: 'absolute', right: 0, top: 0
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
      </Box>
    </Box>
  )

  function handleDragEnd(event) {
    const {active, over} = event;
    setActiveId(null);

    if (active.id !== over.id) {
      setData((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

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
            sx={{mb: 1.25}}
            variant="subtitle2"
          >
            {title}
          </Typography>
          {multiple === true ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              {showDropZone && <ImageDropzone
                onDrop={handleDrop}
                sx={{height: '100%', marginBottom: '15px'}}
              />}
              <SortableContext
                items={data}

              >
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
                  {data.map((image) => (
                    <SortableItem key={image} id={image} handleDeleteImage={handleDeleteImage}>
                      {renderSortableImage(image)}
                    </SortableItem>
                    )
                  )}
                  <DragOverlay>
                    {activeId ? renderSortableImage(activeId) : null}
                  </DragOverlay>
                </Box>
              </SortableContext>
            </DndContext>
          ) : (
            <>
              {showDropZone && <ImageDropzone
                onDrop={handleDrop}
                sx={{height: '100%'}}
              />}
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
              {renderSingleImage(data)}
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
};
