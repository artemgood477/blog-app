// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { auth } from '../firebaseConfig'; // Ensure this matches your Firebase setup

const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  return { user };
};

export default useAuth;  // <-- Ensure this is default export
