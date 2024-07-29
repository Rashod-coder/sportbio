import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported
import { db } from './Firebase/Firebase'; // Adjust the import path if necessary
import { doc, getDocs, collection, updateDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { FaEye } from 'react-icons/fa'; // Import the eye icon from react-icons

function BlogPage() {
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'blogs'));
        const blogData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBlogs(blogData);
      } catch (error) {
        console.error('Error fetching blogs: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
  };

  const formatDate = (timestamp) => {
    if (timestamp && timestamp.toDate) {
      const date = timestamp.toDate();
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = String(date.getFullYear()).slice(-2);
      return `${month}.${day}.${year}`;
    }
    return 'Invalid Date';
  };

  const updateViewCount = async (blogId) => {
    const viewedBlogs = JSON.parse(localStorage.getItem('viewedBlogs')) || {};

    // Check if the blog was already viewed
    if (!viewedBlogs[blogId]) {
      try {
        const blogRef = doc(db, 'blogs', blogId);
        const blogDoc = await getDoc(blogRef);

        if (blogDoc.exists()) {
          const currentViews = blogDoc.data().views || 0;
          await updateDoc(blogRef, { views: currentViews + 1 });
          
          // Mark as viewed
          viewedBlogs[blogId] = true;
          localStorage.setItem('viewedBlogs', JSON.stringify(viewedBlogs));
        }
      } catch (error) {
        console.error('Error updating view count:', error);
      }
    }
  };

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.summary?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Inline styles
  const cardStyle = {
    border: '2px solid black',
    borderRadius: '8px',
    backgroundColor: '#b3daf5',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    marginBottom: '1rem',
    maxHeight: '300px',
    minHeight: '300px',
    display: 'flex',
    flexDirection: 'column',
  };
  const cardBodyStyle = {
    padding: '1rem',
    flex: '1 1 auto',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  };
  const cardTitleStyle = { fontSize: '1.25rem', fontWeight: 'bold' };
  const cardSubtitleStyle = { fontSize: '1rem' };
  const summaryStyle = {
    fontSize: '0.875rem',
    color: '#333',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    marginBottom: '1rem',
  };
  const btnDarkStyle = {
    backgroundColor: '#faf8f2',
    border: 'none',
    color: '#ffffff',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: 'auto',
    color: 'black',
  };
  const btnDarkHoverStyle = {
    backgroundColor: '#0056b3',
  };

  return (
    <div style={{ backgroundColor: '#f0faff', minHeight: '100vh' }}>
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
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: '50vh' }}
          >
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="row">
            {filteredBlogs.length > 0 ? (
              filteredBlogs.map((blog) => (
                <div key={blog.id} className="col-12 col-md-6 col-lg-4 mb-4 mt-5">
                  <div className="card" style={cardStyle}>
                    <div className="card-body" style={cardBodyStyle}>
                      <h5 className="card-title text-dark" style={cardTitleStyle}>
                        {blog.title || 'No Title'}
                      </h5>
                      <h6 className="card-subtitle mb-2  text-dark" style={cardSubtitleStyle}>
                        By {blog.author || 'Unknown'}
                      </h6>
                      <p className="card-text text-dark" style={summaryStyle}>
                        {blog.summary || 'No Summary'}
                      </p>
                      <p className="card-text text-dark ">
                        <small className="text-dark">
                          Date Published: {formatDate(blog.createdAt)}
                        </small>
                      </p>
                      <button
                        className="text-dark"
                        onClick={() => {
                          updateViewCount(blog.id);
                          navigate('/blogs/' + blog.id);
                        }}
                        style={btnDarkStyle}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.backgroundColor = btnDarkHoverStyle.backgroundColor)
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.backgroundColor = btnDarkStyle.backgroundColor)
                        }
                      >
                        Read More
                      </button>
                      <div className="d-flex align-items-center mt-2">
                        <FaEye style={{ marginRight: '0.5rem', color: '#007bff' }} />
                        <span>{blog.views || 0} views</span>
                      </div>
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
      <Analytics />
    </div>
  );
}

export default BlogPage;
