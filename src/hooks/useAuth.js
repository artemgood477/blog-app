import { useState, useEffect } from 'react';
import { auth } from '../firebaseConfig'; 

const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return { user };
};

export default useAuth; 
