import React, { useEffect, useState } from 'react';
import { auth, db } from './Firebase/Firebase';
import { doc, getDoc, addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import 'bootstrap/dist/css/bootstrap.min.css';

function RequestRoleChange() {
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [currentRole, setCurrentRole] = useState('');
  const [requestedLevel, setRequestedLevel] = useState('');
  const [loading, setLoading] = useState(true);
  const [hasPendingRequest, setHasPendingRequest] = useState(false);

  useEffect(() => {
    const fetchUserData = async (user) => {
      try {
        const userDoc = doc(db, 'users', user.uid);
        const userSnapshot = await getDoc(userDoc);

        if (userSnapshot.exists()) {
          const { firstName, lastName, email, accountLevel } = userSnapshot.data();
          setFirstName(firstName);
          setLastName(lastName);
          setEmail(email);
          setCurrentRole(accountLevel);
          setUserId(user.uid);

          // Check if there's an existing role change request
          await checkForExistingRequest(user.uid);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
      setLoading(false);
    };

    const checkForExistingRequest = async (userId) => {
      const requestsQuery = query(collection(db, 'verification'), where('userId', '==', userId));
      const requestSnapshots = await getDocs(requestsQuery);

      // Set hasPendingRequest to true if there are any existing requests
      setHasPendingRequest(!requestSnapshots.empty);
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserData(user);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleRoleRequest = async (e) => {
    e.preventDefault();
    if (!requestedLevel) {
      alert('Please select a role to request.');
      return;
    }
    try {
      const newRequest = {
        userId,
        firstName,
        email,
        requestedLevel,
        currentRole,
      };

      await addDoc(collection(db, 'verification'), newRequest);
      alert('Role change request submitted.');
      setRequestedLevel('');
      setHasPendingRequest(true);
    } catch (error) {
      console.error('Error submitting request: ', error);
    }
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-column align-items-center justify-content-center" style={{ backgroundColor: 'black' }}>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
          <div
            className="spinner-border"
            role="status"
            style={{ width: '3rem', height: '3rem', color: '#333' }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : currentRole === 'basic' ? (
        <div className="container p-4 shadow rounded" style={{ maxWidth: '600px', backgroundColor: '#ffffff', borderRadius: '8px' }}>
          <h2 className="mb-4 text-center" style={{ color: '#333' }}>Request Role Change</h2>
          <p className="lead text-center" style={{ color: '#555' }}>
            Current role: <strong>{currentRole}</strong>
          </p>
          <form onSubmit={handleRoleRequest}>
            <div className="form-group mb-3">
              <label htmlFor="requestedLevel" className="form-label" style={{ color: '#333', fontWeight: '500' }}>Requested Level</label>
              <p>Please note that it may take time to change your account depending on factors, and your account status will only change if you had applied to be part of the team and gotten in.</p>

              <select
                id="requestedLevel"
                className="form-select"
                value={requestedLevel}
                onChange={(e) => setRequestedLevel(e.target.value)}
                style={{ borderColor: '#ddd', borderRadius: '1px', boxShadow: 'none' }}
                required
                disabled={hasPendingRequest} // Disable if there's an existing request
              >
                <option value="" disabled>Select a role</option>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-lg mt-3 w-100"
              style={{ backgroundColor: '#007bff', borderColor: '#007bff', borderRadius: '4px', boxShadow: 'none' }}
              disabled={hasPendingRequest} // Disable button if there's an existing request
            >
              {hasPendingRequest ? 'Request Pending' : 'Submit Request'}
            </button>
          </form>
        </div>
      ) : (
        <div className="container p-4 shadow rounded" style={{ maxWidth: '600px', backgroundColor: '#ffffff', borderRadius: '8px' }}>
          <h2 className="mb-4 text-center" style={{ color: '#333' }}>Role Change Request</h2>
          <p className="text-center" style={{ color: '#555' }}>Only users with a Visitor role can request a role change.</p>
        </div>
      )}
    </div>
  );
}

export default RequestRoleChange;
