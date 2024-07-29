import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported
import { auth, db } from './Firebase/Firebase'; // Adjust the import path if necessary
import { doc, getDocs, collection } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Analytics } from "@vercel/analytics/react"

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

  const formatDate = (timestamp) => {
    if (timestamp && timestamp.toDate) {
      const date = timestamp.toDate(); // Convert Firestore Timestamp to Date
      const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with leading zero if necessary
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (0-based) and pad
      const year = String(date.getFullYear()).slice(-2); // Get last two digits of year
      return `${month}.${day}.${year}`; // Construct formatted string
    }
    return 'Invalid Date'; // Fallback if conversion fails
  };

  const filteredBlogs = blogs.filter(blog => 
    (blog.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    blog.summary?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Inline styles
  const cardStyle = {
    border: '1px solid #007bff',
    borderRadius: '8px',
    backgroundColor: '#b3daf5',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    marginBottom: '1rem',
    maxHeight: '300px',
    minHeight: '300px',
    display: 'flex',
    flexDirection: 'column'
  };
  const cardBodyStyle = {
    padding: '1rem',
    flex: '1 1 auto',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  };
  const cardTitleStyle = { fontSize: '1.25rem', fontWeight: 'bold' };
  const cardSubtitleStyle = { fontSize: '1rem' };
  const summaryStyle = {
    fontSize: '0.875rem',
    color: '#333',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    marginBottom: '1rem'
    
  };
  const btnDarkStyle = {
    backgroundColor: '#faf8f2',
    border: 'none',
    color: '#ffffff',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: 'auto',
    color: 'black'
  };
  const btnDarkHoverStyle = {
    backgroundColor: '#0056b3'
  };

  return (
    <div style={{backgroundColor: '#f0faff', minHeight: '100vh' }}> 
      <div className="container">
        <div className="row justify-content-center mb-4">
          <div className="col-12 col-md-8">
            <h1 className="text-center mt-4 mb-2">View Our Blogs</h1>

            <form className="d-flex" onSubmit={handleSearch} role="search">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search Blogs"
                aria-label="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="btn btn-primary" type="submit">
                Search
              </button>
            </form>
          </div>
        </div>
        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="row">
            {filteredBlogs.length > 0 ? (
              filteredBlogs.map(blog => (
                <div key={blog.id} className="col-12 col-md-6 col-lg-4 mb-4 mt-5">
                  <div className="card" style={cardStyle}>
                    <div className="card-body" style={cardBodyStyle}>
                      <h5 className="card-title text-dark" style={cardTitleStyle}>{blog.title || 'No Title'}</h5>
                      <h6 className="card-subtitle mb-2  text-dark" style={cardSubtitleStyle}>By {blog.author || 'Unknown'}</h6>
                      <p className="card-text text-dark" style={summaryStyle}>{blog.summary || 'No Summary'}</p>
                      <p className="card-text text-dark "><small className="text-dark">Date Published: {formatDate(blog.createdAt)}</small></p>
                      <button className='text-dark'
                        onClick={() => navigate("/blogs/" + blog.id)}
                        style={btnDarkStyle}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = btnDarkHoverStyle.backgroundColor}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = btnDarkStyle.backgroundColor}
                      >
                        Read More
                      </button>
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
      <Analytics/>
    </div>
  );
}

export default BlogPage;
