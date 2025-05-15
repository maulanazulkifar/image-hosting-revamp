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
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Typography,
    Pagination,
    styled,
    Snackbar,
    Alert,
    IconButton,
    Tooltip,
    Fade,
    Paper,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import imageCompression from "browser-image-compression";
import getImage from "../../services/ImageServices/Get";
import PostImage from "../../services/ImageServices/Post";

const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
});

const StyledCard = styled(Card)(({ theme }) => ({
    width: 345,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
    boxShadow: '0 8px 40px -12px rgba(0,0,0,0.2)',
    '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 16px 70px -12px rgba(0,0,0,0.3)',
        '& .card-overlay': {
            opacity: 1,
        },
    },
}));

const CardOverlay = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'opacity 0.3s ease',
}));

const UploadButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    border: 0,
    borderRadius: 30,
    boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
    color: 'white',
    padding: '12px 30px',
    '&:hover': {
        background: 'linear-gradient(45deg, #21CBF3 30%, #2196F3 90%)',
        transform: 'scale(1.05)',
    },
}));

const StyledPagination = styled(Pagination)(({ theme }) => ({
    '& .MuiPaginationItem-root': {
        color: theme.palette.primary.main,
        fontSize: '1rem',
        '&:hover': {
            backgroundColor: 'rgba(33, 150, 243, 0.1)',
        },
        '&.Mui-selected': {
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            color: 'white',
            fontWeight: 'bold',
            '&:hover': {
                backgroundColor: 'linear-gradient(45deg, #21CBF3 30%, #2196F3 90%)',
            }
        }
    },
    '& .MuiPaginationItem-ellipsis': {
        color: theme.palette.primary.main,
    }
}));

const Home = () => {
    const key = import.meta.env.VITE_UPLOAD_KEY;
    const [images, setImages] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const [password, setPassword] = useState();
    const [page, setPage] = useState(1);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const [previewImage, setPreviewImage] = useState(null);
    const imagesPerPage = 9;

    useEffect(() => {
        fetchImage();
    }, [page]);

    const fetchImage = () => {
        setIsLoad(true);
        getImage()
            .then((res) => setImages(res.objects.reverse()))
            .finally(() => setIsLoad(false));
    };

    const handlePostImage = async (data) => {
        if (password === key) {
            const options = {
                maxSizeMB: 1,
                maxWidthOrHeight: 2000,
                useWebWorker: true,
            };

            try {
                setIsLoad(true);
                const compressedFile = await imageCompression(data, options);
                const formData = new FormData();
                formData.append("image", compressedFile);
                await PostImage(formData);
                fetchImage();
                setSnackbar({ open: true, message: "Image uploaded successfully!", severity: "success" });
            } catch (error) {
                setSnackbar({ open: true, message: "Error uploading image.", severity: "error" });
            } finally {
                setIsLoad(false);
            }
        }
    };

    const handleCopyUrl = (url) => {
        navigator.clipboard.writeText(url);
        setSnackbar({ open: true, message: "URL copied to clipboard!", severity: "success" });
    };

    const handleChangePage = (event, value) => setPage(value);

    const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

    const currentImages = images.slice((page - 1) * imagesPerPage, page * imagesPerPage);

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
            <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={password !== key}>
                <Dialog open={password !== key} PaperProps={{ 
                    elevation: 24,
                    sx: { borderRadius: 2, p: 1 }
                }}>
                    <DialogTitle sx={{ textAlign: 'center', color: 'primary.main' }}>
                        Access Locked
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText sx={{ mb: 2 }}>
                            Enter the password to access the page.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            id="password"
                            label="Password"
                            type="password"
                            fullWidth
                            variant="outlined"
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                    </DialogContent>
                </Dialog>
            </Backdrop>

            {isLoad && (
                <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open>
                    <CircularProgress />
                </Backdrop>
            )}

            <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Typography 
                    variant="h3" 
                    component="h1" 
                    sx={{ 
                        fontWeight: 700,
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 2
                    }}
                >
                    Media Image Hosting
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                    Upload, store, and share your images easily
                </Typography>

                <UploadButton
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                    component="label"
                >
                    Upload Image
                    <VisuallyHiddenInput
                        accept="image/*"
                        type="file"
                        onInput={(e) => handlePostImage(e.target.files[0])}
                    />
                </UploadButton>
            </Box>

            <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: 4,
                mb: 4
            }}>
                {currentImages.map((item) => (
                    <Fade in key={item.key}>
                        <StyledCard>
                            <CardMedia
                                component="img"
                                height="200"
                                image={`https://image-hosting.maulanazulkifar.com/${item.key}`}
                                alt="Uploaded"
                                sx={{ objectFit: 'cover' }}
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography 
                                    variant="body2" 
                                    sx={{ 
                                        wordBreak: 'break-all',
                                        mb: 2,
                                        color: 'text.secondary'
                                    }}
                                >
                                    {`https://image-hosting.maulanazulkifar.com/${item.key}`}
                                </Typography>
                            </CardContent>
                            <CardOverlay className="card-overlay">
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Tooltip title="Copy URL">
                                        <IconButton
                                            onClick={() => handleCopyUrl(`https://image-hosting.maulanazulkifar.com/${item.key}`)}
                                            sx={{ color: 'white' }}
                                        >
                                            <ContentCopyIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Preview">
                                        <IconButton
                                            onClick={() => setPreviewImage(`https://image-hosting.maulanazulkifar.com/${item.key}`)}
                                            sx={{ color: 'white' }}
                                        >
                                            <ZoomInIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </CardOverlay>
                        </StyledCard>
                    </Fade>
                ))}
            </Box>

            <Box display="flex" justifyContent="center" sx={{ mt: 6 }}>
                <StyledPagination
                    count={Math.ceil(images.length / imagesPerPage)}
                    page={page}
                    onChange={handleChangePage}
                    variant="outlined"
                    size="large"
                    showFirstButton 
                    showLastButton
                    siblingCount={2}
                />
            </Box>

            <Dialog
                open={Boolean(previewImage)}
                onClose={() => setPreviewImage(null)}
                maxWidth="lg"
                fullWidth
            >
                <DialogContent sx={{ p: 0 }}>
                    {previewImage && (
                        <img
                            src={previewImage}
                            alt="Preview"
                            style={{ width: '100%', height: 'auto' }}
                        />
                    )}
                </DialogContent>
            </Dialog>

            <Snackbar 
                open={snackbar.open} 
                autoHideDuration={3000} 
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    onClose={handleSnackbarClose} 
                    severity={snackbar.severity} 
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Home;
