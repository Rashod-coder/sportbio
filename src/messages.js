import React, { useEffect, useState } from 'react';
import { auth, db } from './Firebase/Firebase';
import { collection, getDocs, orderBy, query, doc, getDoc, deleteDoc } from 'firebase/firestore';
import 'bootstrap/dist/css/bootstrap.min.css';

function ViewMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    const fetchUserAccountLevel = async (user) => {
      try {
        const userDoc = doc(db, 'users', user.uid);
        const userSnapshot = await getDoc(userDoc);

        if (userSnapshot.exists()) {
          const { accountLevel } = userSnapshot.data();
          setIsAdmin(accountLevel === 'admin');
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchMessages = async () => {
      try {
        const messagesQuery = query(collection(db, 'contact'), orderBy('timestamp', 'desc'));
        const messagesSnapshot = await getDocs(messagesQuery);
        const messagesList = messagesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setMessages(messagesList);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
      setLoading(false);
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchUserAccountLevel(user);
        fetchMessages();
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleDeleteMessage = async (messageId) => {
    if (!isAdmin) {
      alert('Only admins can delete messages.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await deleteDoc(doc(db, 'contact', messageId));
        setMessages(messages.filter((message) => message.id !== messageId));
        alert('Message deleted successfully.');
      } catch (error) {
        console.error('Error deleting message:', error);
      }
    }
  };

  return (
    <div className="container">
      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : isAdmin ? (
        <div>
          <h2 className="text-center my-4">Messages</h2>
          {messages.map((message) => (
            <div
              key={message.id}
              className="card my-3"
              style={{
                backgroundColor: selectedMessage?.id === message.id ? '#f0f0f0' : '#ffffff',
              }}
            >
              <div className="card-body">
                <h5 className="card-title">{message.subject}</h5>
                <h6 className="card-subtitle mb-2 text-muted">
                  From: {message.firstName} {message.lastName} ({message.email})
                </h6>
                <p className="card-text">{message.message}</p>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteMessage(message.id)}
                >
                  Delete Message
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center mt-5">Only admins can view messages.</p>
      )}
    </div>
  );
}

export default ViewMessages;
