import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { auth, db } from './Firebase/Firebase';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './Register.css';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log(user.uid);

      try {
        await signOut(auth);
        console.log("Signed out");
      } catch (error) {
        console.log("Error signing out", error);
      }

      try {
        const docRef = doc(db, 'users', user.uid);
        await setDoc(docRef, {
          email: email,
          firstName: firstName,
          lastName: lastName,
          accountLevel: 'basic'
        });
        console.log("Document successfully written!");
      } catch (e) {
        console.error("Error adding document: ", e);
      }

      window.alert("Account Created");
      navigate("/login");
    } catch (error) {
      if (error.code === "auth/weak-password") {
        window.alert("Password must be greater than 6 characters.");
      } else if (error.code === "auth/email-already-in-use") {
        window.alert("Email is already in use.");
      } else {
        window.alert(error.message);
      }
    }
  };

  return (
    <div className='register-background'>
      <div
        className="container d-flex justify-content-center align-items-center min-vh-100"
        style={{
          backgroundImage: "url('images/bg-01.jpg')",
          backgroundSize: 'cover'
        }}
      >
        <div
          className="p-4 shadow"
          style={{
            maxWidth: '450px',
            width: '100%',
            padding: '4rem',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            borderRadius: '10px'
          }}
        >
          <form className="login100-form" onSubmit={handleRegister}>
            <div className="text-center mb-4">
              <span className="login100-form-logo" style={{ fontSize: '3rem' }}>
                <i className="zmdi zmdi-landscape"></i>
              </span>
            </div>
            <h2 className="text-center mb-4">Register</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="form-group mb-4">
              <input
                className="form-control form-control-lg"
                type="text"
                name="firstName"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                style={{
                  border: 'none',
                  borderBottom: '2px solid #000',
                  borderRadius: '0',
                  background: 'transparent',
                  padding: '10px 0',
                  fontSize: '1rem',
                  color: '#000',
                  outline: 'none',
                  width: '100%',
                }}
              />
            </div>
            <div className="form-group mb-4">
              <input
                className="form-control form-control-lg"
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                style={{
                  border: 'none',
                  borderBottom: '2px solid #000',
                  borderRadius: '0',
                  background: 'transparent',
                  padding: '10px 0',
                  fontSize: '1rem',
                  color: '#000',
                  outline: 'none',
                  width: '100%',
                }}
              />
            </div>
            <div className="form-group mb-4">
              <input
                className="form-control form-control-lg"
                type="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  border: 'none',
                  borderBottom: '2px solid #000',
                  borderRadius: '0',
                  background: 'transparent',
                  padding: '10px 0',
                  fontSize: '1rem',
                  color: '#000',
                  width: '100%',
                }}
              />
            </div>
            <div className="form-group mb-4">
              <input
                className="form-control form-control-lg"
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  border: 'none',
                  borderBottom: '2px solid #000',
                  borderRadius: '0',
                  background: 'transparent',
                  padding: '10px 0',
                  fontSize: '1rem',
                  color: '#000',
                  outline: 'none',
                  width: '100%',
                }}
              />
            </div>
            <div className="text-center mt-4 py-5">
              <button
                style={{ width: '300px', backgroundColor: '#007bff', border: 'none', color: '#fff', borderRadius: '10px', fontSize: '1.2rem', padding: '10px 20px' }}
                className="btn btn-primary btn-lg"
                type="submit"
              >
                Register
              </button>
            </div>
            <p>If you're a team member creating an account you will have to be manually approved to a higher account level by admin</p>
            <div className="text-center">
              <a className="text-muted" href="/login">
                Already have an account? Log in here
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
