import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import BlogCard from '../components/BlogCard';
import useAuth from '../hooks/useAuth';

const ViewBlogDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth(); 
  const [blogData, setBlogData] = useState({});

  useEffect(() => {
    const getBlogData = async () => {
      const snap = await getDoc(doc(db, 'blogs', id));
      if (snap.exists()) {
        console.log(snap.data(), 'snap.data()');
        setBlogData(snap.data());
      }
    };
    getBlogData();
  }, [id]);

  return (
    <BlogCard 
      blog={{ ...blogData, id }} 
      showDeleteIcon={false} 
      currentUser={user} 
    />
  );
};

export default ViewBlogDetailsPage;
