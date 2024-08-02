// src/EditBio.js

import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './Firebase/Firebase'; // Ensure correct path to Firebase config
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function EditBio() {
  const [officer, setOfficer] = useState(null);
  const [bio, setBio] = useState('');
  const [role, setRole] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const navigate = useNavigate();
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    if (!userId) {
      navigate('/login'); // Redirect if not authenticated
      return;
    }

    const fetchOfficer = async () => {
      const docRef = doc(db, 'team', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setOfficer(data);
        setBio(data.bio || '');
        setRole(data.role || '');
        setProfilePictureUrl(data.profilePicture || '');
      } else {
        console.error('No such document!');
        navigate('/officers'); // Redirect if no document found
      }
    };

    fetchOfficer();
  }, [userId, navigate]);

  const handleProfilePictureChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const storageRef = ref(storage, `profilePictures/${userId}/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setProfilePictureUrl(url);
    }
  };

  const handleSave = async () => {
    try {
      await updateDoc(doc(db, 'team', userId), {
        bio,
        role,
        profilePicture: profilePictureUrl,
      });
      alert('Profile updated successfully');
      navigate('/officers');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (!officer) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Edit Your Bio</h1>
      <div style={styles.form}>
        <label style={styles.label}>Bio:</label>
        <textarea
          style={styles.textarea}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
        <label style={styles.label}>Role:</label>
        <input
          type="text"
          style={styles.input}
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
        <label style={styles.label}>Profile Picture:</label>
        <input
          type="file"
          style={styles.input}
          onChange={handleProfilePictureChange}
        />
        {profilePictureUrl && <img src={profilePictureUrl} alt="Profile" style={styles.image} />}
        <button style={styles.button} onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    textAlign: 'center',
  },
  header: {
    marginBottom: '20px',
    fontSize: '2rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  label: {
    marginBottom: '10px',
    fontSize: '1rem',
  },
  textarea: {
    width: '300px',
    height: '100px',
    marginBottom: '10px',
  },
  input: {
    marginBottom: '10px',
  },
  image: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    marginTop: '10px',
  },
  button: {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    padding: '10px 15px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
};

export default EditBio;
