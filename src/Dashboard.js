import React, { useState, useEffect } from 'react';
import { auth, db } from './Firebase/Firebase';
import { doc, getDoc, addDoc, collection, updateDoc, deleteDoc, query, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function Dashboard() {
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(true);
  const [accountLevel, setAccountLevel] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [postSummary, setPostSummary] = useState('');
  const [postContent, setPostContent] = useState('');
  const [showPostForm, setShowPostForm] = useState(false);
  const [showTeamVerification, setShowTeamVerification] = useState(false);
  const [verificationRequests, setVerificationRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userDoc = doc(db, 'users', user.uid);
          const userSnapshot = await getDoc(userDoc);

          if (userSnapshot.exists()) {
            const { firstName, lastName, accountLevel } = userSnapshot.data();
            setUserName(`${firstName} ${lastName}`);
            setAccountLevel(accountLevel);
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setAuthenticated(false);
        navigate('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (accountLevel === 'admin') {
      const fetchVerificationRequests = async () => {
        const q = query(collection(db, 'verification'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          console.log('Fetched verification requests:', requests); // Debug log
          setVerificationRequests(requests);
        });

        return () => unsubscribe();
      };

      fetchVerificationRequests();
    }
  }, [accountLevel]);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    try {
      const newPost = {
        title: postTitle,
        summary: postSummary,
        content: postContent,
        author: userName,
        createdAt: new Date(),
      };

      await addDoc(collection(db, 'blogs'), newPost);

      console.log('Post submitted:', newPost);
      setPostTitle('');
      setPostSummary('');
      setPostContent('');
      setShowPostForm(false);
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  const handleRoleChange = async (verificationId, userId, newRole) => {
    try {
      // Update the user role
      const userDoc = doc(db, 'users', userId);
      await updateDoc(userDoc, { accountLevel: newRole });

      // Delete the verification request
      const verificationDoc = doc(db, 'verification', verificationId);
      await deleteDoc(verificationDoc);

      console.log(`User role updated to ${newRole} and verification request deleted`);
    } catch (error) {
      console.error('Error updating role or deleting request: ', error);
    }
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-column align-items-center">
      <div className="container mt-5">
        {loading ? (
          <div className="d-flex justify-content-center align-items-center min-vh-100">
            <div
              className="spinner-border"
              role="status"
              style={{ width: '3rem', height: '3rem' }}
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : authenticated ? (
          <>
            <h1 className="display-4 text-center mb-4">Welcome, {userName}!</h1>
            <p className="lead text-center">
              Current account level: <strong>{accountLevel}</strong>
            </p>

            {(accountLevel === 'admin' || accountLevel === 'staff') && (
              <>
                <button
                  className="btn btn-primary btn-lg my-4 me-3"
                  onClick={() => setShowPostForm(!showPostForm)}
                >
                  {showPostForm ? 'Cancel' : 'Create Post'}
                </button>

                {(accountLevel === 'admin') && (
                  <button
                    className="btn btn-info btn-lg my-4"
                    onClick={() => setShowTeamVerification(!showTeamVerification)}
                  >
                    {showTeamVerification ? 'Hide Team Verification' : 'View Team Verification'}
                  </button>
                )}

                {showPostForm && (
                  <div className="mt-5 mb-5 p-4 bg-white shadow rounded">
                    <h2 className="mb-4">Create a New Blog Post</h2>
                    <form onSubmit={handlePostSubmit}>
                      <div className="form-group mb-3">
                        <label htmlFor="postTitle" className="form-label">
                          Title
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="postTitle"
                          placeholder="Enter post title"
                          value={postTitle}
                          onChange={(e) => setPostTitle(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group mb-3">
                        <label htmlFor="postSummary" className="form-label">
                          Summary
                        </label>
                        <textarea
                          className="form-control"
                          id="postSummary"
                          rows="2"
                          placeholder="Enter post summary"
                          value={postSummary}
                          onChange={(e) => setPostSummary(e.target.value)}
                          required
                        ></textarea>
                      </div>
                      <div className="form-group mb-3">
                        <label htmlFor="postContent" className="form-label">
                          Content
                        </label>
                        <ReactQuill
                          theme="snow"
                          value={postContent}
                          onChange={setPostContent}
                          placeholder="Write your post here"
                          modules={{
                            toolbar: [
                              [{ header: [1, 2, false] }],
                              ['bold', 'italic', 'underline', 'strike'],
                              [{ list: 'ordered' }, { list: 'bullet' }],
                              ['link', 'image'],
                              ['clean'],
                            ],
                          }}
                        />
                      </div>
                      <button type="submit" className="btn btn-success btn-lg mt-3">
                        Submit
                      </button>
                    </form>
                  </div>
                )}

                {showTeamVerification && (
                  <div className="mt-5 p-4 bg-white shadow rounded">
                    <h2 className="mb-4">Team Verification Requests</h2>
                    {verificationRequests.length > 0 ? (
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th>User ID</th>
                            <th>User Email</th>
                            <th>Requested Level</th>
                            <th>Current Role</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {verificationRequests.map((request) => (
                            <tr key={request.id}>
                              <td>{request.userId}</td>
                              <td>{request.email}</td>
                              <td>{request.requestedLevel}</td>
                              <td>{request.currentRole}</td>
                              <td>
                                <select
                                  className="form-select"
                                  onChange={(e) => handleRoleChange(request.id, request.userId, e.target.value)}
                                >
                                  <option value="" disabled>Select Role</option>
                                  <option value="basic">Basic</option>
                                  <option value="staff">Staff</option>
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p>No verification requests available.</p>
                    )}
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <p>Redirecting to login...</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
