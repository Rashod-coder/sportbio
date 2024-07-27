// src/BlogPage.js
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported
import { auth, db } from './Firebase/Firebase'; // Adjust the import path if necessary
import { doc, getDocs, collection } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';


function BlogPage() {
    const navigate = useNavigate();

  const [blogs, setBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'blogs'));
        const blogData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setBlogs(blogData);
      } catch (error) {
        console.error("Error fetching blogs: ", error);
      } finally {
        setLoading(false); // Set loading to false when done
      }
    };

    fetchBlogs();
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    // The search logic can be handled here if you want to search on the client side
    // For now, we'll just filter the blogs on each render based on searchQuery
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const filteredBlogs = blogs.filter(blog => 
    (blog.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    blog.summary?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="container mt-2" style={{ minHeight: '100vh' }}>
      <h1 className="text-center mb-4">View Our Blogs</h1>
      <div className="row justify-content-center mb-4">
        <div className="col-12 col-md-12 col-lg-12 col-sm-12">
          <form className="d-flex" onSubmit={handleSearch} role="search">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search Blogs"
              aria-label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="btn btn-outline-success" type="submit">
              Search
            </button>
          </form>
        </div>
      </div>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
          <div  className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row">
          {filteredBlogs.length > 0 ? (
            filteredBlogs.map(blog => (
              <div key={blog.id} className="col-12 col-md-6 col-lg-4 mb-4">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{blog.title || 'No Title'}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">By {blog.author || 'Unknown'}</h6>
                    <p className="card-text"> <p style={{fontWeight: 'bold'}}>Summary:</p> {blog.summary || 'No Summary'}</p>
                    <p className="card-text"><small className="text-muted">Date Published: </small></p>
                    <a  onClick={() => navigate("/blogs/" + blog.id)} className="btn btn-dark">View More</a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">No blogs found</p>
          )}
        </div>
      )}
    </div>
  );
}

export default BlogPage;
