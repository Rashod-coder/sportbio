import React, { useState, useEffect } from 'react';
import { auth, db } from './Firebase/Firebase';
import { doc, getDoc, addDoc, collection, updateDoc, deleteDoc, query, onSnapshot, getDocs, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import RequestRoleChange from './verify';
import ViewMessages from './messages';
import { Analytics } from "@vercel/analytics/react"

function Dashboard() {
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(true);
  const [accountLevel, setAccountLevel] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [postSummary, setPostSummary] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postMessage, setPostMessage] = useState('');
  const [summaryWordCount, setSummaryWordCount] = useState(0);
  const [userId, setUserId] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [verificationRequests, setVerificationRequests] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
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
      setPostMessage("Blog Succesfully Published vist the Blog page to see your blog! ")
      setTimeout(() => {
        setPostMessage('');
      }, 10000); 
      
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
      const verificationDoc = doc(db, 'verification', verificationId);
      await deleteDoc(verificationDoc);
  
      console.log('Verification request rejected and deleted');
    } catch (error) {
      console.error('Error deleting request: ', error);
    }
  };

  const handleRoleChange = async (verificationId, userId, newRole) => {
    try {
      const userDoc = doc(db, 'users', userId);
      await updateDoc(userDoc, { accountLevel: newRole });
      window.alert(`User role updated to ${newRole}`)
      const verificationDoc = doc(db, 'verification', verificationId);
      await deleteDoc(verificationDoc);

      window.location.reload();

    } catch (error) {
      console.error('Error updating role or deleting request: ', error);
    }
  };
  
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const handleRemoveFromTeam = async (userId) => {
    try {
      const userDoc = doc(db, 'users', userId);
      await updateDoc(userDoc, { accountLevel: 'basic' });
      window.alert("Member removed from team")
      window.location.reload();

    } catch (error) {
      console.error('Error removing from team: ', error);
    }
  };



  return (
    <div className="min-vh-100 d-flex flex-column align-items-center" style={{ backgroundColor: '#edf4fa' }}>
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
            <h1 className="display-4 text-center mb-4" style={{ color: '#003366' }}>Welcome {userName}!</h1>
            <div className='container'>
              <div className='row'>
                <div className='col-sm-4'>
                <p className="display-5 text-center" style={{ color: '#003366' }}>
                  Current Account Level: <strong>{accountLevel}</strong>
                </p>
                
                </div>
                
              </div>
            </div>
            

            {(accountLevel === 'admin' || accountLevel === 'staff') && (
              <>
                <div className="mt-5 mb-5 p-4 shadow rounded" style={{ backgroundColor: '"rgba(255, 255, 255, 0.4)', overflowX: 'auto', display: 'block', overflowY: 'auto', height: '250px' }}>
                  <h2 className="mb-4" style={{ color: '#003366' }}>Team Members (Staff)</h2>
                  {teamMembers.length > 0 ? (
                    <table className="table table-bordered" style={{ borderColor: '#003366' }}>
                      <thead>
  <tr style={{ backgroundColor: '#003366', color: 'white' }}>
    <th scope="col">Member Name</th>
    <th scope="col">Email</th>
    <th scope="col">Role</th>
    <th scope="col">Action</th> 
  </tr>
</thead>
<tbody>
  {teamMembers.map(member => (
    <tr key={member.id}>
      <td>{member.firstName} {member.lastName}</td>
      <td>{member.email}</td>
      <td>{member.accountLevel}</td>
      <td>
        {accountLevel === 'admin' && member.accountLevel !== 'admin' ? (
          <button
            className="btn btn-danger btn-sm"
            onClick={() => handleRemoveFromTeam(member.id)}
          >
            Remove from Team
          </button>
        ) : (
          <button
            className="btn btn-danger btn-sm"
            disabled
          >
            Remove from Team
          </button>
        )}
      </td>
    </tr>
  ))}
</tbody>
                    </table>
                  ) : (
                    <p>No staff members found.</p>
                  )}
                </div>

                <div className="mt-5 mb-5 p-4 shadow rounded" style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)' }}>
                  <h2 className="mb-4" style={{ color: '#003366' }}>Create a New Blog Post</h2>
                  {postMessage && (
  <div className="alert alert-success" role="alert">
    {postMessage}
  </div>
)}
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
                        height: '200px',
                        overflow: 'auto',
                        backgroundColor: 'white',
                      }}
                      placeholder="Enter your content here"
                    />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ backgroundColor: '#003366', borderColor: '#003366' }}
                    >
                      Submit
                    </button>
                  </form>
                </div>

                <div className="mt-5 mb-5 p-4 shadow rounded" style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)' }}>
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
                    <p>No verification requests at the moment.</p>
                  )}
                </div>
              </>
            )}

            <div>
              <RequestRoleChange userId={userId} userName={userName} userEmail={userEmail} />
            </div>
            <div className="mt-5 mb-5">
              <ViewMessages/>
            </div>
            <Analytics />
          </>
        ) : (
          <p>Please log in to access the dashboard.</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
