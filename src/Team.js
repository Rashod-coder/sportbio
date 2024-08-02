import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './Firebase/Firebase';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Officers() {
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOfficers = async () => {
      try {
        const profileCollectionRef = collection(db, 'profile');
        const querySnapshot = await getDocs(profileCollectionRef);

        if (querySnapshot.empty) {
          console.log('No officers found.');
          return;
        }

        const officersData = [];
        querySnapshot.forEach((docSnapshot) => {
          const data = docSnapshot.data();
          const userId = docSnapshot.id;

          if (data.accountLevel === 'admin' || data.accountLevel === 'staff') {
            const officerData = {
              id: userId,
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email || 'No email available',
              bio: data.bio || 'No bio available',
              profilePicture: data.profilePicture || 'No Picture Avaliable',
              role: data.role || 'No role available',
              instagram: data.instagram || 'No Instagram given',
              linkedin: data.linkedin || 'No LinkedIn given',
            };
            officersData.push(officerData);
          }
        });

        setOfficers(officersData);
      } catch (error) {
        console.error('Error fetching officers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOfficers();
  }, []);

  function formatURL(url) {
    if (!url) return '#';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://${url}`;
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <h1 style={{ marginBottom: '20px', fontSize: '2.5rem', color: '#003366' }}>Meet Our Team</h1>
          <div className="container">
            {officers.length === 0 ? (
              <p>No officers found.</p>
            ) : (
              officers.map((officer) => (
                <div key={officer.id} className="row mb-4" style={{ alignItems: 'center', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)', padding: '20px' }}>
                  <div className="col-md-3 text-center">
                    <img src={officer.profilePicture} alt={`${officer.firstName} ${officer.lastName}`} className="img-fluid rounded-circle" style={{ width: '200px', height: '200px', objectFit: 'cover', border: '3px solid #003366' }} />
                  </div>
                  <div className="col-md-9 text-start">
                    <h2 style={{ fontSize: '1.5rem', color: '#003366' }}>{officer.firstName} {officer.lastName}</h2>
                    <p style={{ color: '#555' }}>{officer.bio}</p>
                    <p style={{ color: '#007bff' }}><strong>Email:</strong> {officer.email}</p>
                    <p style={{ color: 'black' }}><strong>Role:</strong> {officer.role}</p>
                    <p>
                      <a href={formatURL(officer.instagram)} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', textDecoration: 'none', margin: '0 5px' }}>Instagram</a>
                      <span> | </span>
                      <a href={formatURL(officer.linkedin)} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', textDecoration: 'none', margin: '0 5px' }}>LinkedIn</a>
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Officers;
