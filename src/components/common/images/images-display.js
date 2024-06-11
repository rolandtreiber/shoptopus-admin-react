import {Box, Card, CardContent, Divider} from "@material-ui/core";
import NoImg from '../../../static/images/no-image.png'
import Lightbox from "react-awesome-lightbox";
import {useState} from "react";
import TrCardHeader from "../translated/translated-card-header";

const ImagesDisplay = ({styles, images, coverPhoto}) => {
    const [ showLightbox, setShowLightbox ] = useState(false)
    const [ startIndex, setStartIndex ] = useState(0)

  if (!coverPhoto) {
    coverPhoto = images[0];
  }

  const imagesWithoutCover = () => {
    return images.filter(img => img.url !== coverPhoto.url)
  }

  return (
    <Card
      variant="outlined"
      {...styles}
    >
      <TrCardHeader
        title="Product Images"
        variant="outlined"
      />
      <Divider/>
      <CardContent>
        <Box
          sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <img
              onClick={() => {
                  setShowLightbox(true);
                  setStartIndex(0);
              }}
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
            {showLightbox && <Lightbox startIndex={startIndex} onClose={() => setShowLightbox(false)} images={images}/>}
        {imagesWithoutCover().map((image, index) => (
            <img
              key={image.url}
              alt={image.title ? image.title : ""}
              src={image.url}
              onClick={() => {
                  setShowLightbox(true);
                  setStartIndex(index);
              }}
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