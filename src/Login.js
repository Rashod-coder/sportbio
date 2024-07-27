// src/Login.js
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { auth } from './Firebase/Firebase';
import './Login.css'

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Set Firebase Authentication persistence
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            setUser(user);
            navigate('/dashboard'); // Redirect to Dashboard if user is authenticated
          } else {
            setUser(null);
          }
        });

        return () => unsubscribe();
      })
      .catch((error) => {
        console.error('Error setting persistence:', error);
      });
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard'); // Redirect to Dashboard on successful login
    } catch (err) {
      setError('Incorrect login details. Please try again.');
      setTimeout(() => setError(''), 5000); // Clear error message after 5 seconds
    }
  };

  return (
    <div className='login-background'>
    <div
      className="container d-flex justify-content-center align-items-center min-vh-100"
       // Blue background
    >
      <div
        className="p-4  rounded shadow"
        style={{
          maxWidth: '450px', // Max width for larger screens
          width: '100%',     // Full width for smaller screens
          padding: '4rem',   // Padding to make it larger
          height: 'auto',
          minHeight: '500px',
          backgroundColor: 'rgba(255, 255, 255, 0.5)'   // Adjust height to fit content
        }}
      >
        <form className="login100-form" onSubmit={handleLogin}>
          <div className="text-center mb-4">
            <span className="login100-form-logo" style={{ fontSize: '3rem', color: '#000' }}>
              <i className="zmdi zmdi-landscape"></i>
            </span>
          </div>
          <h2 className="text-center mb-4" style={{ color: '#000' }}>Login</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="form-group mb-4">
            <input
              className="form-control form-control-lg"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ borderColor: '#000', color: '#000' }}
            />
          </div>
          <div className="form-group mb-4">
            <input
              className="form-control form-control-lg"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ borderColor: '#000', color: '#000' }}
            />
          </div>
          <div className="text-center mb-4 mt-4 py-5">
            <button style={{ width: '300px', backgroundColor: '#007bff', color: '#fff' }} className="btn btn-primary btn-lg" type="submit">
              Login
            </button>
          </div>
          <div className="text-center">
            <a className="text-muted" href="/register" style={{ color: '#000', textDecoration: 'none' }}>
              Don't have an account? Sign up here
            </a>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
}

export default Login;
