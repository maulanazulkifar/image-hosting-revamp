import {
    Box,
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardMedia,
    Container,
    styled,
    Typography
} from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {useEffect, useState} from "react";
import getImage from "../../services/ImageServices/Get.js";
import PostImage from "../../services/ImageServices/Post.js";

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const Home = () => {
    const [images, setImages] = useState([]);
    useEffect(() =>{
        fetchImage();
    },[])
    const fetchImage = () => {
        getImage().then(res => {
            setImages(res.objects);
        })
    }
    const handlePostImage = (data) => {
        const formData = new FormData();
        formData.append("image", data);
        PostImage(data).then(res => {
            console.log(res);
        })
    }
    return(
      <Container>
          <Typography variant={'h4'}>Media<br/>Image Hosting Server</Typography>
          <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
          >
              Upload file
              <VisuallyHiddenInput type="file" onInput={e => handlePostImage(e.target.files[0])}/>
          </Button>
          <Box sx={{display: 'flex'}} flexWrap={'wrap'} justifyContent={"center"} columnGap={2} rowGap={2}>
              {
                  images.map(item => {
                      return(
                          <div key={item.key}>
                              <Card sx={{ width: 345 }}>
                                  <CardActionArea>
                                      <CardMedia
                                          component="img"
                                          height="140"
                                          image={'https://image-hosting.maulanazulkifar.com/'+item.key}
                                          alt="green iguana"
                                      />
                                      <CardContent>
                                          <Typography gutterBottom variant="h5" component="div">
                                              Lizard
                                          </Typography>
                                      </CardContent>
                                  </CardActionArea>
                              </Card>
                          </div>
                      )
                  })
              }
          </Box>

      </Container>
    )
}

export default Home;