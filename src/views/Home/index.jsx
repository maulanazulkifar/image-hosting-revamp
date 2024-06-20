import React, { useEffect, useState } from "react";
import {
    Backdrop,
    Box,
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardMedia, CircularProgress,
    Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Input, InputAdornment,
    styled, TextField,
    Typography
} from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import imageCompression from 'browser-image-compression';
import getImage from "../../services/ImageServices/Get";
import PostImage from "../../services/ImageServices/Post";

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
    const [isLoad, setIsLoad] = useState(false);
    const [password, setPassword] = useState();

    useEffect(() => {
        fetchImage();
    }, []);

    const fetchImage = () => {
        setIsLoad(true);
        getImage().then(res => {
            setImages(res.objects);
        }).finally(() => {
            setIsLoad(false);
        });
    };

    const handlePostImage = async (data) => {
        if (password === 'imi2024') {
            const options = {
                maxSizeMB: 1,
                maxWidthOrHeight: 2000,
                useWebWorker: true
            };

            try {
                setIsLoad(true);
                const compressedFile = await imageCompression(data, options);
                const formData = new FormData();
                formData.append("image", compressedFile);
                PostImage(formData).then(res => {
                    console.log(res);
                }).finally(() => {
                    fetchImage();
                });
            } catch (error) {
                console.error("Error while compressing image", error);
            } finally {
                setIsLoad(false);
            }
        }
    };

    return (
        <Container>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={password !== 'imi2024'}
            >
                <Dialog open={password !== 'imi2024'}>
                    <DialogTitle>Locked</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Masukan Password untuk mengakses halaman atau minta ke administrator
                        </DialogContentText>
                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            id="password"
                            name="password"
                            label="Password"
                            type="password"
                            fullWidth
                            variant="outlined"
                            onChange={event => setPassword(event.target.value)}
                        />
                    </DialogContent>
                </Dialog>
            </Backdrop>
            {isLoad && (
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={true}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            )}
            <Typography variant={'h4'}>Media<br/>Image Hosting Server</Typography>
            <Box paddingY={2}>
                <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                >
                    Upload file
                    <VisuallyHiddenInput accept="image/*"  type="file" onInput={e => handlePostImage(e.target.files[0])} />
                </Button>
            </Box>
            <Box sx={{display: 'flex'}} flexWrap={'wrap'} justifyContent={"center"} columnGap={2} rowGap={2}>
                {images.toReversed().map(item => (
                    <div key={item.key}>
                        <Card sx={{ width: 345 }}>
                            <CardMedia
                                component="img"
                                height="140"
                                image={'https://image-hosting.maulanazulkifar.com/' + item.key}
                                alt="green iguana"
                            />
                            <CardContent>
                                <Box sx={{display: 'flex'}}>
                                    <input
                                        readOnly
                                        className='form-control'
                                        type='text'
                                        id='input-with-icon-adornment'
                                        placeholder='Search order'
                                        aria-label='Search'
                                        value={'https://image-hosting.maulanazulkifar.com/' + item.key}
                                    />
                                    <Button onClick={() => navigator.clipboard.writeText('https://image-hosting.maulanazulkifar.com/' + item.key)}>
                                        Copy
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </div>
                ))}
            </Box>
        </Container>
    );
};

export default Home;
