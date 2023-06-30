import React from "react";
import {Box, Card, CardContent, CardHeader, Divider} from "@material-ui/core";
import NoImg from '../../../static/images/no-image.png'

const ImagesDisplay = ({styles, images, coverPhoto}) => {
  if (!coverPhoto) {
    coverPhoto = images[0];
  }

  const imagesWithoutCover = () => {
    return images.filter(img => img.id !== coverPhoto.id)
  }

  return (
    <Card
      variant="outlined"
      {...styles}
    >
      <CardHeader
        title="Product Images"
        variant="outlined"
      />
      <Divider/>
      <CardContent>
        <Box
          sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <img
            alt={coverPhoto?.title ? coverPhoto.title : "no-image"}
            src={coverPhoto?.url ? coverPhoto.url : NoImg}
            style={{
              maxWidth: '100%'
            }}
          />
        </Box>
        <Box
          sx={{
            display: 'grid',
            gap: 1,
            gridTemplateColumns: ({
              md: 'repeat(4, 1fr)',
              sm: 'repeat(4, 1fr)',
              xs: 'repeat(2, 1fr)'
            }),
            '& img': {
              borderRadius: 1,
              maxWidth: '100%'
            },
            mt: 2
          }}
        >
        {imagesWithoutCover().map(image => (
            <img
              key={image.url}
              alt={image.title ? image.title : ""}
              src={image.url}
              style={{
                maxWidth: '100%'
              }}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}

export default ImagesDisplay