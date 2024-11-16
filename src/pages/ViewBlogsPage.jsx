import { doc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { Box, Divider, Typography } from '@mui/material';
import BlogCard from '../components/BlogCard';
import Alert from '../components/Alert';
import useAuth from '../hooks/useAuth';

const ViewBlogsPage = () => {
  const { user } = useAuth(); 
  const blogCollectionReference = collection(db, 'blogs');
  const [blogsList, setBlogsList] = useState([]);
  const [alertConfig, setAlertConfig] = useState({});

  const getBlogsList = async () => {
    const blogs = await getDocs(blogCollectionReference);
    const extractedBlogs = blogs.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setBlogsList(extractedBlogs);
    console.log(extractedBlogs, 'blogs');
  };

  const deleteBlog = async (id) => {
    const blogDoc = doc(db, 'blogs', id);
    try {
      await deleteDoc(blogDoc);
      setAlertConfig({
        message: 'Successfully deleted the blog',
        color: 'success',
        isOpen: true,
      });
      setBlogsList((prev) => prev.filter((blog) => blog.id !== id));
    } catch (error) {
      setAlertConfig({
        message: 'Error deleting the blog',
        color: 'error',
        isOpen: true,
      });
    }
  };

  useEffect(() => {
    getBlogsList();
  }, []);

  return (
    <Box display="flex" flexDirection="column" gap="20px">
      <Typography variant="h3">View Blogs</Typography>
      <Divider />
      <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap="16px">
        {blogsList.map((blog) => (
          <BlogCard
            key={blog.id}
            blog={blog}
            deleteBlog={deleteBlog}
            currentUser={user}
            showDeleteIcon={!!user}
          />
        ))}
      </Box>
      <Alert alertConfig={alertConfig} />
    </Box>
  );
};

export default ViewBlogsPage;
