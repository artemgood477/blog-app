// src/pages/ViewFavoritesPage.jsx
import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, getDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import BlogCard from '../components/BlogCard';
import useAuth from '../hooks/useAuth';  // <-- Default import

const ViewFavoritesPage = () => {
    const { user: currentUser } = useAuth();  // Destructure `user` from the object returned by `useAuth`
    const [favoriteBlogs, setFavoriteBlogs] = useState([]);

    useEffect(() => {
        const fetchFavorites = async () => {
            if (currentUser) {
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
            }
        };
        fetchFavorites();
    }, [currentUser]);

    return (
        <div>
            <h2>Your Favorite Blogs</h2>
            <div>
                {favoriteBlogs.map((blog) => (
                    <BlogCard key={blog.id} blog={blog} currentUser={currentUser} />
                ))}
            </div>
        </div>
    );
};

export default ViewFavoritesPage;
