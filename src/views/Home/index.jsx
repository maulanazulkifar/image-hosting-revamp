import React, { useEffect, useState } from "react";
import {
    Backdrop,
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    TextField,
    Typography,
    Pagination, styled
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
    const key = import.meta.env.VITE_UPLOAD_KEY;
    const [images, setImages] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const [password, setPassword] = useState();
    const [page, setPage] = useState(1);
    const imagesPerPage = 6;

    useEffect(() => {
        fetchImage();
    }, [page]);

    const fetchImage = () => {
        setIsLoad(true);
        getImage().then(res => {
            setImages(res.objects);
        }).finally(() => {
            setIsLoad(false);
        });
    };

    const handlePostImage = async (data) => {
        if (password === key) {
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

    const handleChangePage = (event, value) => {
        setPage(value);
    };

    const currentImages = images.slice((page - 1) * imagesPerPage, page * imagesPerPage);

    return (
        <Container>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={password !== key}
            >
                <Dialog open={password !== key}>
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

            <Typography variant="h4" align="center" sx={{ mb: 3 }}>
                Media Image Hosting Server
            </Typography>

            <Box paddingY={2} display="flex" justifyContent="center">
                <Button
                    component="label"
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                    sx={{ width: 'auto', textAlign: 'center' }}
                >
                    Upload file
                    <VisuallyHiddenInput accept="image/*" type="file" onInput={e => handlePostImage(e.target.files[0])} />
                </Button>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2 }}>
                {currentImages.map(item => (
                    <Card sx={{ width: 345, boxShadow: 3, transition: 'transform 0.3s ease', '&:hover': { transform: 'scale(1.05)' } }} key={item.key}>
                        <CardMedia
                            component="img"
                            height="140"
                            image={'https://image-hosting.maulanazulkifar.com/' + item.key}
                            alt="Uploaded Image"
                        />
                        <CardContent>
                            <Typography variant="h6" component="div" sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                Image URL
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <input
                                    readOnly
                                    className='form-control'
                                    type='text'
                                    value={'https://image-hosting.maulanazulkifar.com/' + item.key}
                                    style={{ flex: 1, padding: 8, fontSize: 14 }}
                                />
                                <Button
                                    onClick={() => navigator.clipboard.writeText('https://image-hosting.maulanazulkifar.com/' + item.key)}
                                    variant="contained"
                                    size="small"
                                    sx={{ ml: 1 }}
                                >
                                    Copy
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Pagination
                    count={Math.ceil(images.length / imagesPerPage)}
                    page={page}
                    onChange={handleChangePage}
                    color="primary"
                />
            </Box>
        </Container>
    );
};

export default Home;
