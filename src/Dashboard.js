import React, { useState, useEffect } from 'react';
import { auth, db } from './Firebase/Firebase';
import { doc, getDoc, addDoc, collection, updateDoc, deleteDoc, query, onSnapshot, getDocs, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import RequestRoleChange from './verify';


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
  const [summaryWordCount, setSummaryWordCount] = useState(0);
  const [userId, setUserId] = useState('');
const [userEmail, setUserEmail] = useState('');
  const [verificationRequests, setVerificationRequests] = useState([]);
  const navigate = useNavigate();
  const [teamMembers, setTeamMembers] = useState([]);


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
      window.alert("Image Size too Big")
    }
  };
  const handleSummaryChange = (e) => {
    const value = e.target.value;
    const words = value.split(/\s+/).filter((word) => word.length > 0);
    if (words.length <= 100) {
      setPostSummary(value);
      setSummaryWordCount(words.length);
    }
  };

  useEffect(() => {
    const fetchTeamMembers = async () => {
        const q = query(collection(db, 'users'), where('accountLevel', 'in', ['staff', 'admin']));
                const querySnapshot = await getDocs(q);
      const members = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTeamMembers(members);
    };

    fetchTeamMembers();
  }, [accountLevel]);

  const handleRejectRequest = async (verificationId) => {
    try {
      // Delete the verification request
      const verificationDoc = doc(db, 'verification', verificationId);
      await deleteDoc(verificationDoc);
  
      console.log('Verification request rejected and deleted');
    } catch (error) {
      console.error('Error deleting request: ', error);
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
    <div className="bg-light min-vh-100 d-flex flex-column align-items-center" style={{ backgroundColor: '#e6f0ff' }}>
      <div className="container mt-5">
        {loading ? (
          <div className="d-flex justify-content-center align-items-center min-vh-100">
            <div
              className="spinner-border"
              role="status"
              style={{ width: '3rem', height: '3rem', color: '#003366' }}
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : authenticated ? (
          <>
            <h1 className="display-4 text-center mb-4" style={{ color: '#003366' }}>Welcome, {userName}!</h1>
            <p className="lead text-center" style={{ color: '#003366' }}>
              Current account level: <strong>{accountLevel}</strong>
            </p>

           

            {(accountLevel === 'admin' || accountLevel === 'staff') && (
                
              <>
               <div className="mt-5 mb-5 p-4 shadow rounded" style={{ backgroundColor: '#d1d7de', overflowX: 'auto', display: 'block', overflowY: 'auto', height: '250px' }}>
                    <h2 className="mb-4" style={{ color: '#003366' }}>Team Members (Staff)</h2>
                    {teamMembers.length > 0 ? (
                      <table className="table table-bordered" style={{ borderColor: '#003366' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#003366', color: 'white' }}>
                            <th scope="col">First Name</th>
                            <th scope="col">Last Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Role</th>
                          </tr>
                        </thead>
                        <tbody>
                          {teamMembers.map(member => (
                            <tr key={member.id}>
                              <td>{member.firstName}</td>
                              <td>{member.lastName}</td>
                              <td>{member.email}</td>
                              <td>{member.accountLevel}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p>No staff members found.</p>
                    )}
                  </div>
                <button
                  className="btn btn-primary btn-lg my-4 me-3"
                  style={{ backgroundColor: '#003366', borderColor: '#003366' }}
                  onClick={() => setShowPostForm(!showPostForm)}
                >
                  {showPostForm ? 'Cancel Post' : 'Create Post'}
                </button>

                {(accountLevel === 'admin') && (
                  <button
                    className="btn btn-info btn-lg my-4 text-light"
                    style={{ backgroundColor: '#003366', borderColor: '#003366' }}
                    onClick={() => setShowTeamVerification(!showTeamVerification)}
                  >
                    {showTeamVerification ? 'Hide Team Verification' : 'View Team Verification'}
                  </button>
                )}

                {showPostForm && (
                  <div className="mt-5 mb-5 p-4  shadow rounded" style={{ backgroundColor: '#d1d7de' }}>
                    <h2 className="mb-4" style={{ color: '#003366' }}>Create a New Blog Post</h2>
                    <form onSubmit={handlePostSubmit}>
                      <div className="form-group mb-3">
                        <label htmlFor="postTitle" className="form-label" style={{ color: '#003366' }}>
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
                          style={{ borderColor: '#003366' }}
                        />
                      </div>
                      <div className="form-group mb-3">
                        <label htmlFor="postSummary" className="form-label" style={{ color: '#003366' }}>
                          Summary
                        </label>
                        <textarea
                          className="form-control"
                          id="postSummary"
                          rows="2"
                          placeholder="Enter post summary"
                          value={postSummary}
                          onChange={handleSummaryChange}
                          required
                          style={{ borderColor: '#003366', minHeight: '100px', maxHeight: '100px' }}
                          
                        ></textarea>
                        <small className="form-text text-muted">
                          {summaryWordCount}/100 words
                        </small>
                      </div>
                      <div className="form-group mb-5">
                        <label htmlFor="postContent" className="form-label" style={{ color: '#003366' }}>
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
                          style={{
                            borderColor: '#003366',
                            height: 'auto',
                            backgroundColor: 'white',
                          }}
                        />
                      </div>
                      <button type="submit" className="btn btn-success btn-lg mt-5 " style={{ backgroundColor: '#003366', borderColor: '#003366' }}>
                        Submit
                      </button>
                    </form>
                  </div>
                )}

                {showTeamVerification && (
                    <div className="mt-5 mb-5 p-4 shadow rounded" style={{ backgroundColor: '#d1d7de', overflowX: 'auto', display: 'block' }}>
                    <h2 className="mb-4" style={{ color: '#003366' }}>Team Verification Requests</h2>
                    {verificationRequests.length > 0 ? (
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>User Email</th>
                            <th>Requested Level</th>
                            <th>Current Role</th>
                            <th>Action</th>
                            <th>Reject</th>
                          </tr>
                        </thead>
                        <tbody>
                          {verificationRequests.map((request) => (
                            <tr key={request.id}>
                              <td>{request.firstName}</td>
                              <td>{request.email}</td>
                              <td>{request.requestedLevel}</td>
                              <td>{request.currentRole}</td>
                              
                              <td>
                                <select
                                  className="form-select"
                                  onChange={(e) => handleRoleChange(request.id, request.userId, e.target.value)}
                                  style={{ borderColor: '#003366' }}
                                >
                                  <option value="">Select Role</option>
                                  <option value="basic">Basic</option>
                                  <option value="staff">Staff</option>
                                </select>
                                
                              </td>
                              <td><button
          className="btn btn-danger btn-sm"
          onClick={() => handleRejectRequest(request.id)}
          style={{ marginLeft: '10px' }}
        >
          Reject
        </button></td>
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
            {/* Render the RequestRoleChange component for basic users */}
            {accountLevel === 'basic' && (
              <div>
                <h2 className="text-center" style={{ color: '#003366' }}>Request Account Level Change</h2>
                <RequestRoleChange userId={userId} userEmail={userEmail} userName={userName} />
              </div>
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