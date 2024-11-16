import { Button, Card, CardActions, CardContent, CardMedia, Chip, IconButton, Typography, Box } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const BlogCard = ({ blog, currentUser }) => {
    const navigate = useNavigate();
    const [isFavorite, setIsFavorite] = useState(false);
    
    useEffect(() => {
        if (currentUser) {
            const checkFavorite = async () => {
                const favDoc = await getDoc(doc(db, 'favorites', `${currentUser.uid}_${blog.id}`));
                setIsFavorite(favDoc.exists());
            };
            checkFavorite();
        }
    }, [blog.id, currentUser]);

    const handleFavoriteToggle = async () => {
        const favRef = doc(db, 'favorites', `${currentUser.uid}_${blog.id}`);
        if (isFavorite) {
            await deleteDoc(favRef);
            setIsFavorite(false);
        } else {
            await setDoc(favRef, { userId: currentUser.uid, blogId: blog.id });
            setIsFavorite(true);
        }
    };

    return (
        <Box sx={{width: 290, maxWidth: '100%', margin: '50px' }}>  {/* Set width or maxWidth here */}
            <Card style={{ position: 'relative' }}>
                <CardMedia sx={{ height: 200 }} image={blog.image} title={blog.title} />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {blog.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {blog.description}
                    </Typography>
                    <Chip label={blog.category} variant="outlined" />
                </CardContent>
            </Card>
        </Box>
    );
};

export default BlogCard;
