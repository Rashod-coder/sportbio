import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, storage, auth } from './Firebase/Firebase'; // Adjust the import path as needed
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Profile.css'; // Custom CSS file for additional styles

function ProfileEdit() {
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    instagram: '',
    linkedin: '',
    bio: '',
    profilePicture: '', // Store URL here
    role: '', // Add role to the profileData state
  });
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(true);
  const [uploading, setUploading] = useState(false); // State for upload loading
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const profileDocRef = doc(db, 'profile', user.uid);
          const profileDoc = await getDoc(profileDocRef);

          if (profileDoc.exists()) {
            const data = profileDoc.data();
            let profilePictureUrl = '';
            if (data.profilePicture) {
              const profilePicRef = ref(storage, data.profilePicture);
              profilePictureUrl = await getDownloadURL(profilePicRef);
            }

            setProfileData({
              ...data,
              profilePicture: profilePictureUrl, // Set the URL for displaying
            });
          } else {
            console.log('No profile document found!');
          }
        } else {
          setAuthenticated(false);
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
      setLoading(false);
    };

    fetchProfileData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true); // Set loading to true
      const user = auth.currentUser;
      const storageRef = ref(storage, `profilePictures/${user.uid}/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setProfileData((prevData) => ({ ...prevData, profilePicture: url }));
      setUploading(false); // Set loading to false
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (user) {
        const profileDocRef = doc(db, 'profile', user.uid);
        await updateDoc(profileDocRef, {
          ...profileData,
          profilePicture: profileData.profilePicture, // Save the URL in Firestore
        });
        console.log('Profile updated successfully');
        // Clear form fields after successful update
        setProfileData({
          firstName: '',
          lastName: '',
          email: '',
          instagram: '',
          linkedin: '',
          bio: '',
          profilePicture: '', // Reset to empty string
          role: '', // Reset role
        });
        window.alert("Profile Settings Uploaded! Visit the team page to view the changes")
        window.location.reload()      
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="container mt-5">
      {loading ? (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : !authenticated ? (
        <div className="text-center mt-5 mb-5">
          <p>You are not authenticated. Please log in.</p>
          <a href="/login" className="btn btn-primary">Login</a>
        </div>
      ) : (
        <div className="profile-edit mt-5 p-4 shadow rounded mb-5">
          <h2 className="mb-4">Edit Profile</h2>
          <form onSubmit={handleUpdateProfile}>
            <div className="mb-3">
              <label htmlFor="firstName" className="form-label">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className="form-control"
                value={profileData.firstName}
                onChange={handleChange}
                required
                disabled
              />
            </div>
            <div className="mb-3">
              <label htmlFor="lastName" className="form-label">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className="form-control"
                value={profileData.lastName}
                onChange={handleChange}
                required
                aria-disabled
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control"
                value={profileData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="instagram" className="form-label">Instagram</label>
              <input
                type="text"
                id="instagram"
                name="instagram"
                className="form-control"
                value={profileData.instagram}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="linkedin" className="form-label">LinkedIn</label>
              <input
                type="text"
                id="linkedin"
                name="linkedin"
                className="form-control"
                value={profileData.linkedin}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="profilePicture" className="form-label">Profile Picture</label>
              <input
                type="file"
                id="profilePicture"
                name="profilePicture"
                className="form-control"
                onChange={handleProfilePictureChange}
              />
              <p className='mt-2'>This is how your profile picture will look on team page.</p>
              <div className="position-relative">
                {uploading ? (
                  <div className="position-absolute top-50 start-50 translate-middle spinner-border" role="status" style={{minHeight: '10vh'}}>
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  profileData.profilePicture && (
                    <img
                      src={profileData.profilePicture}
                      alt="Profile"
                      className="img-thumbnail mt-2"
                      style={{ width: '200px', height: '200px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #003366', margin: '0 auto 15px' }}
                    />
                  )
                )}
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="bio" className="form-label">Bio</label>
              <textarea
                id="bio"
                name="bio"
                className="form-control"
                value={profileData.bio}
                onChange={handleChange}
                style={{maxHeight: '45px', minHeight: '45px'}}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="role" className="form-label">Role</label>
              <input
                type="text"
                id="role"
                name="role"
                className="form-control"
                value={profileData.role}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">Update Profile</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ProfileEdit;
