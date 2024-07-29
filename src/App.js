import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Outlet, Link } from 'react-router-dom';
import Navbar from './Navbar';
import Blog from './Blog';
import About from './About';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import Footer from './Footer';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import Fundraiser from './Fundraising';
import Posts from './Post';
import './App.css';
import { Analytics } from "@vercel/analytics/react";

// Define the NotFound component directly here
const NotFound = () => {
  return (
    <div style={{ textAlign: 'center', padding: '50px', minHeight: '90vh' }}>
      <h1 className='display-3'>404</h1>
      <p>Page Not Found</p>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="blogs" element={<Blog />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="volunteer" element={<Fundraiser />} />
            <Route path="blogs/:id" element={<Posts />} />

            <Route
              path="dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        <Analytics />
      </Router>
    </AuthProvider>
  );
}

function Layout() {
  const location = useLocation();

  useEffect(() => {
    // Scroll to the About section if the path is '/about' and we have a hash
    if (location.hash) {
      const element = document.getElementById(location.hash.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  // List of paths where the Footer should not be displayed
  const noFooterPaths = ['/dashboard', '/login', '/register'];
  
  // Check if the current path starts with `/blogs/`
  const isBlogPage = location.pathname.startsWith('/blogs/');

  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      {!noFooterPaths.includes(location.pathname) && !isBlogPage && <Footer />}
    </>
  );
}

export default App;
