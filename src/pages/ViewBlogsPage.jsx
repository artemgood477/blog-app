import { collection, doc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { Box, Divider, Typography, IconButton, Button } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BlogCard from '../components/BlogCard';
import Alert from '../components/Alert';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const ViewBlogsPage = () => {
  const { user } = useAuth();  // Get the current user from authentication
  const blogCollectionReference = collection(db, 'blogs');
  const [blogsList, setBlogsList] = useState([]);
  const [favoriteBlogs, setFavoriteBlogs] = useState(new Set()); // Set to track favorite blogIds
  const [alertConfig, setAlertConfig] = useState({});
  const navigate = useNavigate();

  // Fetch the blogs list
  const getBlogsList = async () => {
    const blogs = await getDocs(blogCollectionReference);
    const extractedBlogs = blogs.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });

    setBlogsList(extractedBlogs);
    console.log(extractedBlogs, 'blogs');
  };

  // Fetch favorite blogs for the current user
  const getFavoriteBlogs = async () => {
    if (user) {
      const favoritesCollection = collection(db, 'favorites');
      const favorites = await getDocs(favoritesCollection);
      const userFavorites = new Set();

      favorites.docs.forEach((doc) => {
        const data = doc.data();
        if (data.userId === user.uid) {
          userFavorites.add(data.blogId);
        }
      });

      setFavoriteBlogs(userFavorites);
    }
  };

  // Add or remove blog from favorites
  const handleFavorite = async (blogId) => {
    if (user) {
      const favoriteRef = doc(db, 'favorites', blogId);

      if (favoriteBlogs.has(blogId)) {
        // Remove from favorites
        await deleteDoc(favoriteRef);
        setFavoriteBlogs((prev) => {
          const updated = new Set(prev);
          updated.delete(blogId);
          return updated;
        });
        setAlertConfig({
          ...alertConfig,
          message: 'Blog removed from favorites',
          color: 'info',
          isOpen: true,
        });
      } else {
        // Add to favorites
        await setDoc(favoriteRef, {
          userId: user.uid,
          blogId: blogId,
        });
        setFavoriteBlogs((prev) => new Set(prev).add(blogId));
        setAlertConfig({
          ...alertConfig,
          message: 'Blog added to favorites',
          color: 'success',
          isOpen: true,
        });
      }
    }
  };

  // Delete blog
  const deleteBlog = async (id) => {
    const blogDoc = doc(db, 'blogs', id);

    try {
      await deleteDoc(blogDoc);
      setAlertConfig({
        ...alertConfig,
        message: 'Successfully deleted the blog',
        color: 'success',
        isOpen: true,
      });
    } catch (error) {
      setAlertConfig({
        ...alertConfig,
        message: 'Error deleting the blog',
        color: 'error',
        isOpen: true,
      });
    }
  };

  useEffect(() => {
    getBlogsList();
    getFavoriteBlogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <Box display="flex" flexDirection="column" gap="20px">
      <Typography variant="h3">View Blogs</Typography>
      <Divider />
      <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="16px">
        {blogsList.map((blog, index) => (
          <Box
            key={index}
            display="flex"
            flexDirection="column"
            alignItems="center"
            position="relative"
          >
            <BlogCard blog={blog} deleteBlog={deleteBlog} /> {/* Pass deleteBlog function */}
            <Box display="flex" flexDirection="column" alignItems="center" position="absolute" bottom="-50px">
              {/* Favorite Button */}
              <IconButton
                onClick={() => handleFavorite(blog.id)}
                color={favoriteBlogs.has(blog.id) ? 'error' : 'default'}
                sx={{
                  fontSize: '2rem',
                  transition: 'color 0.3s ease',
                  '&:hover': {
                    color: favoriteBlogs.has(blog.id) ? 'darkred' : 'gray',
                  },
                }}
              >
                <FavoriteIcon style={{ color: favoriteBlogs.has(blog.id) ? 'red' : 'gray' }} />
              </IconButton>
              {/* Learn More Button */}
              <Button
                color="secondary"
                variant="contained"
                onClick={() => navigate(`/viewblogs/${blog.id}`)} // Navigate to individual blog details page
              >
                Learn More
              </Button>
            </Box>
          </Box>
        ))}
      </Box>
      <Alert alertConfig={alertConfig} />
    </Box>
  );
};

export default ViewBlogsPage;
