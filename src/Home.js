// src/BlogPage.js
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported
import { auth } from './Firebase/Firebase'; // Import Firebase authentication
import { onAuthStateChanged } from 'firebase/auth';

function BlogPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // Use null to represent loading state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check the authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  if (loading) {
    // Show loading message while checking authentication
    return <div className="container mt-2"><h1>Loading authentication status...</h1></div>;
  }

  return (
    <div className="container mt-2">
      <h1 className='display-1'>
        {isLoggedIn ? 'You are logged in' : 'You are not logged in'}
      </h1>
    </div>
  );
}

export default BlogPage;
