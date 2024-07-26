// src/BlogPage.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported

function BlogPage() {
  return (
    <div className="container mt-2">
      <h1 className="text-center mb-4">View Our Blogs</h1>
      <div className="row justify-content-center">
        <div className="col-12 col-md-12 col-lg-12 col-sm-12">
          <form className="d-flex" role="search">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search Blogs"
              aria-label="Search"
            />
            <button className="btn btn-outline-success" type="submit">
              Search
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BlogPage;
