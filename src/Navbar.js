import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { signOut } from 'firebase/auth';
import { auth } from './Firebase/Firebase'; // Ensure the path to your Firebase configuration is correct

function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Set up an authentication listener to check if the user is logged in or not
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe(); // Clean up the listener on component unmount
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = '/';
      window.alert('You have signed out');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark" aria-label="Offcanvas navbar large">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">Sport Injury Bio</a>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="offcanvas" 
          data-bs-target="#offcanvasNavbar2" 
          aria-controls="offcanvasNavbar2"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div 
          className="offcanvas offcanvas-start text-bg-dark" // Offcanvas starts from the left
          tabIndex="-1" 
          id="offcanvasNavbar2" 
          aria-labelledby="offcanvasNavbar2Label"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasNavbar2Label">Sport Injury Bio</h5>
            <button 
              type="button" 
              className="btn-close btn-close-white" 
              data-bs-dismiss="offcanvas" 
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body">
            <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
              <li className="nav-item">
                <a className="nav-link" href="/about">About</a>
              </li>
              <li className="nav-item dropdown">
              <a style={{ color: 'white' }} className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Account
              </a>
                <ul className="dropdown-menu">
                  {user ? (
                    <>
                      <li><a className="dropdown-item" href="/dashboard">Dashboard</a></li>
                      <li><hr className="dropdown-divider" /></li>
                      <li><a className="dropdown-item" href="#" onClick={handleLogout}>Logout</a></li>
                    </>
                  ) : (
                    <>
                      <li><a className="dropdown-item" href="/login">Login</a></li>
                      <li><a className="dropdown-item" href="/register">Register</a></li>
                    </>
                  )}
                </ul>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#contact">Contact</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/blogs">Blogs</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/volunteer">Fundraising & Volunteering</a>
              </li>
              
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
