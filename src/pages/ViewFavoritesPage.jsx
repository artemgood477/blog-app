import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, getDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import BlogCard from '../components/BlogCard';
import useAuth from '../hooks/useAuth';
import { Box, Typography, Grid, CircularProgress } from '@mui/material';

const ViewFavoritesPage = () => {
    const { user: currentUser } = useAuth();
    const [favoriteBlogs, setFavoriteBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFavorites = async () => {
            if (currentUser) {
                try {
                    const favsQuery = query(
                        collection(db, 'favorites'),
                        where('userId', '==', currentUser.uid)
                    );
                    const favSnapshot = await getDocs(favsQuery);
                    const favBlogIds = favSnapshot.docs.map(doc => doc.data().blogId);

                    const blogData = await Promise.all(
                        favBlogIds.map(async (blogId) => {
                            const blogDoc = await getDoc(doc(db, 'blogs', blogId));
                            return { id: blogDoc.id, ...blogDoc.data() };
                        })
                    );
                    setFavoriteBlogs(blogData);
                } catch (error) {
                    console.error('Error fetching favorites:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        fetchFavorites();
    }, [currentUser]);

    return (
        <Box padding="20px">
            <Typography variant="h4" gutterBottom>
                Your Favorite Blogs
            </Typography>

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
                    <CircularProgress />
                </Box>
            ) : favoriteBlogs.length === 0 ? (
                <Typography variant="body1" color="text.secondary" textAlign="center">
                    You haven't added any blogs to your favorites yet.
                </Typography>
            ) : (
                <Grid container spacing={3}>
                    {favoriteBlogs.map((blog) => (
                        <Grid item xs={12} sm={6} md={4} key={blog.id}>
                            <BlogCard blog={blog} currentUser={currentUser} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default ViewFavoritesPage;
