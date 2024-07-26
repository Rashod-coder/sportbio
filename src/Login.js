// src/Login.js
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './Firebase/Firebase';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState(null); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        navigate('/'); // Redirect to Dashboard if user is authenticated
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/'); // Redirect to Dashboard on successful login
    } catch (err) {
      setError('Incorrect login details. Please try again.');
      setTimeout(() => setError(''), 5000); // Clear error message after 5 seconds
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center min-vh-100"
      style={{ backgroundImage: "url('images/bg-01.jpg')", backgroundSize: 'cover' }}
    >
      <div
        className="p-4 bg-transparent rounded shadow"
        style={{
          maxWidth: '450px', // Max width for larger screens
          width: '100%',     // Full width for smaller screens
          padding: '4rem',   // Padding to make it larger
          height: 'auto',
          minHeight: '500px'    // Adjust height to fit content
        }}
      >
        <form className="login100-form" onSubmit={handleLogin}>
          <div className="text-center mb-4">
            <span className="login100-form-logo" style={{ fontSize: '3rem' }}>
              <i className="zmdi zmdi-landscape"></i>
            </span>
          </div>
          <h2 className="text-center mb-4">Log in</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="form-group mb-4">
            <input
              className="form-control form-control-lg"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
            />
          </div>
          <div className="text-center mb-4 mt-4 py-5">
            <button style={{width: '300px'}} className="btn btn-primary btn-lg" type="submit">
              Login
            </button>
          </div>
          <div className="text-center">
            <a className="text-muted" href="/register">
              Don't have an account? Sign up here
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
