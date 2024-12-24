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
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
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

const Home = () => {
    const key = import.meta.env.VITE_UPLOAD_KEY;
    const [images, setImages] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const [password, setPassword] = useState();
    const [page, setPage] = useState(1);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const imagesPerPage = 6;

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

    const handleChangePage = (event, value) => setPage(value);

    const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

    const currentImages = images.slice((page - 1) * imagesPerPage, page * imagesPerPage);

    return (
        <Container sx={{ mt: 4 }}>
            <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={password !== key}>
                <Dialog open={password !== key}>
                    <DialogTitle>Access Locked</DialogTitle>
                    <DialogContent>
                        <DialogContentText>Enter the password to access the page.</DialogContentText>
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
                        />
                    </DialogContent>
                </Dialog>
            </Backdrop>

            {isLoad && (
                <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open>
                    <CircularProgress />
                </Backdrop>
            )}

            <Typography variant="h4" align="center" gutterBottom>
                Media Image Hosting
            </Typography>

            <Box display="flex" justifyContent="center" sx={{ mb: 3 }}>
                <Button
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                    component="label"
                    sx={{ px: 4, py: 1.5 }}
                >
                    Upload Image
                    <VisuallyHiddenInput
                        accept="image/*"
                        type="file"
                        onInput={(e) => handlePostImage(e.target.files[0])}
                    />
                </Button>
            </Box>

            <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 2 }}>
                {currentImages.map((item) => (
                    <Card
                        key={item.key}
                        sx={{
                            width: 345,
                            transition: "transform 0.3s ease",
                            "&:hover": { transform: "scale(1.05)" },
                        }}
                    >
                        <CardMedia
                            component="img"
                            height="200"
                            image={`https://image-hosting.maulanazulkifar.com/${item.key}`}
                            alt="Uploaded"
                        />
                        <CardContent>
                            <Typography variant="body2" sx={{ wordWrap: "break-word" }}>
                                {`https://image-hosting.maulanazulkifar.com/${item.key}`}
                            </Typography>
                            <Button
                                variant="contained"
                                size="small"
                                onClick={() =>
                                    navigator.clipboard.writeText(
                                        `https://image-hosting.maulanazulkifar.com/${item.key}`
                                    )
                                }
                                sx={{ mt: 1 }}
                            >
                                Copy URL
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </Box>

            <Box display="flex" justifyContent="center" sx={{ mt: 3 }}>
                <Pagination
                    count={Math.ceil(images.length / imagesPerPage)}
                    page={page}
                    onChange={handleChangePage}
                    variant="outlined"
                    color="primary"
                />
            </Box>

            <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Home;
