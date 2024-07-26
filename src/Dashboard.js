import React, { useState, useEffect } from 'react';
import { auth, db } from './Firebase/Firebase'; // Ensure the path is correct
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [userName, setUserName] = useState(''); // State to hold user name
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [authenticated, setAuthenticated] = useState(true); // State to manage authentication
  const [accountLevel, setAccountLevel] = useState(''); // State to hold user name
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userDoc = doc(db, 'users', user.uid); // Reference to the user's document
          const userSnapshot = await getDoc(userDoc);
          
          if (userSnapshot.exists()) {
            const { firstName, lastName, accountLevel } = userSnapshot.data();
            setUserName(`${firstName} ${lastName}`); // Set the user's full name
            setAccountLevel(accountLevel)
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setAuthenticated(false);
        navigate('/login'); // Redirect to login if no user is signed in
      }
      setLoading(false); // Set loading to false once data is fetched or no user is authenticated
    });

    return () => unsubscribe(); // Clean up subscription on unmount
  }, [navigate]);

  return (
    <div style={{ backgroundColor: 'white', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {loading ? (
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      ) : authenticated ? (
        <div className="container mt-4">
          <h1>Dashboard</h1>
          <p>Welcome, {userName}!</p>
          <p>Current account level: {accountLevel}</p>
        </div>
      ) : (
        <p>Redirecting to login...</p>
      )}
    </div>
  );
}

export default Dashboard;
