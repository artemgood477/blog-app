/* eslint-disable react/prop-types */
import { Card, CardActions, CardContent, CardMedia, Chip, IconButton, Typography } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const BlogCard = (props) => {
  const { blog, deleteBlog = () => {}, showDeleteIcon = true, currentUser } = props;
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
    <Card style={{ position: 'relative' }}>
      <CardMedia
        sx={{ height: 300 }}
        image={blog.image}
        title={blog.title}
      />
      {showDeleteIcon && (
        <IconButton
          style={{ position: 'absolute', right: '10px', top: '5px' }}
          aria-label="delete"
          size="small"
          onClick={() => deleteBlog(blog.id)}
        >
          <DeleteIcon fontSize="inherit" />
        </IconButton>
      )}
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {blog.title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {blog.description}
        </Typography>
        <Chip label={blog.category} variant="outlined" />
      </CardContent>
      <CardActions>
        <IconButton onClick={handleFavoriteToggle} color={isFavorite ? 'error' : 'default'}>
          <FavoriteIcon style={{ color: isFavorite ? 'red' : 'gray' }} />
        </IconButton>
        <Typography>{isFavorite ? 'Unfavorite' : 'Favorite'}</Typography>
        <button onClick={() => navigate(`/viewblogs/${blog.id}`)}>Learn More</button>
      </CardActions>
    </Card>
  );
};

export default BlogCard;
