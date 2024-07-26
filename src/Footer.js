import React from 'react';
import { FaLinkedin, FaInstagram } from 'react-icons/fa'; // Import the icons from react-icons

function Footer() {
  return (
    <footer
      className="bg-dark text-light py-4"
      style={{ position: 'relative', bottom: '0', width: '100%' }}
    >
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-4 text-center text-md-start mb-3 mb-md-0">
            <p className="mb-0">© 2024 Sport Injury Bio</p>
          </div>
          <div className="col-md-4 text-center">
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-light mx-2"
              style={{ fontSize: '1.5rem' }}
            >
              <FaLinkedin />
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-light mx-2"
              style={{ fontSize: '1.5rem' }}
            >
              <FaInstagram />
            </a>
          </div>
          <div className="col-md-4 text-center text-md-end">
            <ul className="list-inline mb-0">
              <li className="list-inline-item">
                <a href="/" className="text-light text-decoration-none">
                  Home
                </a>
              </li>
              <li className="list-inline-item">
                <a href="/about" className="text-light text-decoration-none">
                  About
                </a>
              </li>
              <li className="list-inline-item">
                <a href="/contact" className="text-light text-decoration-none">
                  Contact
                </a>
              </li>
              <li className="list-inline-item">
                <a href="/blog" className="text-light text-decoration-none">
                  Blog
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
