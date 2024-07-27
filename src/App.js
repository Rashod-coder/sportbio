import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Outlet } from 'react-router-dom';
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

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/blogs" element={<Blog />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/volunteer" element={<Fundraiser />} />
            <Route path="/blogs/:id" element={<Posts />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

function Layout() {
  const location = useLocation();
  
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
