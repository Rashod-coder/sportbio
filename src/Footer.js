import React, { useState } from 'react';
import { FaLinkedin, FaInstagram, FaEnvelope } from 'react-icons/fa';
import { collection, addDoc } from 'firebase/firestore';
import { db } from './Firebase/Firebase'; // Import the Firestore database instance
import sportLogo from './sportLogo.png';

function Footer() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, 'contact'), {
        firstName,
        lastName,
        email,
        subject,
        message,
        timestamp: new Date(),
      });

      setFeedback('Message has been sent we will get back to you shortly');
      setFirstName('');
      setLastName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (error) {
      console.error('Error adding document: ', error);
      setFeedback('Sorry, there was an error. Please try again.');
    }
  };

  return (
    <div
      className="text-dark py-4"
      style={{
        position: 'relative',
        bottom: '0',
        width: '100%',
        backgroundColor: '#f0f8ff',
       
      }}
    >
      <div className="container" id='footer'>
        <div className="row mt-4">
          <div className="col-lg-12 mx-auto">
            <h2
              className="text-center mb-4"
              style={{ color: '#333', fontSize: '2rem', fontWeight: 'bold' }}
            >
              Contact Us!
            </h2>
            <form
              onSubmit={handleSubmit}
              style={{
                border: '1px solid #ccc',
                borderRadius: '10px',
                padding: '20px',
                backgroundColor: '#ffffff',
              }}
            >
              <div className="row">
                <div className="col-md-6 mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    style={{
                      border: 'none',
                      borderBottom: '1px solid #ccc',
                      borderRadius: '0',
                      outline: 'none',
                      boxShadow: 'none',
                      transition: 'border-color 0.3s',
                      backgroundColor: 'transparent',
                    }}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    style={{
                      border: 'none',
                      borderBottom: '1px solid #ccc',
                      borderRadius: '0',
                      outline: 'none',
                      boxShadow: 'none',
                      transition: 'border-color 0.3s',
                      backgroundColor: 'transparent',
                    }}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                      border: 'none',
                      borderBottom: '1px solid #ccc',
                      borderRadius: '0',
                      outline: 'none',
                      boxShadow: 'none',
                      transition: 'border-color 0.3s',
                      backgroundColor: 'transparent',
                    }}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    style={{
                      border: 'none',
                      borderBottom: '1px solid #ccc',
                      borderRadius: '0',
                      outline: 'none',
                      boxShadow: 'none',
                      transition: 'border-color 0.3s',
                      backgroundColor: 'transparent',
                    }}
                  />
                </div>
              </div>
              <div className="mb-3">
                <textarea
                  className="form-control"
                  placeholder="Write your message"
                  rows="3"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  style={{
                    border: 'none',
                    borderBottom: '1px solid #ccc',
                    borderRadius: '0',
                    outline: 'none',
                    boxShadow: 'none',
                    transition: 'border-color 0.3s',
                    backgroundColor: 'transparent',
                    minHeight: '200px',
                    maxHeight: '200px',
                  }}
                ></textarea>
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  background: 'linear-gradient(90deg, rgba(216,247,255,1) 0%, rgba(206,227,250,1) 35%, rgba(0,212,255,1) 100%)',
                  border: 'none',
                  color: '#fff',
                  padding: '10px 20px',
                  borderRadius: '5px',
                }}
              >
                Submit
              </button>
            </form>
            {feedback && (
              
              <div class="alert alert-success" role="alert">
  {feedback}
</div>
            )}
          </div>
        </div>
        <hr></hr>
        <div className="row align-items-center mt-5">
          <div className="col-md-4 text-center text-md-start mb-3 mb-md-0">
            <img
              src={sportLogo}
              alt="Sport Injury Bio Logo"
              style={{ maxWidth: '150px', height: 'auto' }}
              className="mb-3"
            />
            <p className="mb-0" style={{ color: '#333', fontSize: '1rem' }}>
              <FaEnvelope className="me-2" /> info@sportinjurybio.com
            </p>
          </div>
          <div className="col-md-4 text-center">
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-dark mx-2"
              style={{ fontSize: '3.5rem' }}
            >
              <FaLinkedin />
            </a>
            <a
              href="https://www.instagram.com/sportinjurybio?igsh=MzRlODBiNWFlZA=="
              target="_blank"
              rel="noopener noreferrer"
              className="text-dark mx-2"
              style={{ fontSize: '3.5rem' }}
            >
              <FaInstagram />
            </a>
          </div>
          <div className="col-md-4 text-center text-md-end">
            <ul className="list-inline mb-0">
              <li className="list-inline-item">
                <a
                  href="/"
                  className="text-dark text-decoration-none"
                  style={{ fontSize: '1rem', color: '#333' }}
                >
                  Home
                </a>
              </li>
              <li className="list-inline-item">
                <a
                  href="/about"
                  className="text-dark text-decoration-none"
                  style={{ fontSize: '1rem', color: '#333' }}
                >
                  About
                </a>
              </li>
              <li className="list-inline-item">
                <a
                  href="/contact"
                  className="text-dark text-decoration-none"
                  style={{ fontSize: '1rem', color: '#333' }}
                >
                  Contact
                </a>
              </li>
              <li className="list-inline-item">
                <a
                  href="/blog"
                  className="text-dark text-decoration-none"
                  style={{ fontSize: '1rem', color: '#333' }}
                >
                  Blog
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div
          className="text-center mt-4"
          style={{ color: '#333', fontSize: '1rem' }}
        >
          © 2024 Sport Injury Bio
        </div>
      </div>
    </div>
  );
}

export default Footer;
