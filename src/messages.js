import React, { useEffect, useState } from "react";
import { auth, db } from "./Firebase/Firebase";
import {
  collection,
  getDocs,
  orderBy,
  query,
  doc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import "bootstrap/dist/css/bootstrap.min.css";

function ViewMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    const fetchUserAccountLevel = async (user) => {
      try {
        const userDoc = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userDoc);

        if (userSnapshot.exists()) {
          const { accountLevel } = userSnapshot.data();
          setIsAdmin(accountLevel === "admin");
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchMessages = async () => {
      try {
        const messagesQuery = query(
          collection(db, "contact"),
          orderBy("timestamp", "desc")
        );
        const messagesSnapshot = await getDocs(messagesQuery);
        const messagesList = messagesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(messagesList);
      } catch (error) {
        console.error("Error fetching messages:", error);
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
      alert("Only admins can delete messages.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        await deleteDoc(doc(db, "contact", messageId));
        setMessages(messages.filter((message) => message.id !== messageId));
        alert("Message deleted successfully.");
      } catch (error) {
        console.error("Error deleting message:", error);
      }
    }
  };

  return (
    <div
      className="container mt-5"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.1)", // More transparent white
        borderRadius: "15px",
        padding: "20px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.37)", // Enhanced shadow for a 3D effect
        backdropFilter: "blur(8px)", // Adds a blur effect for a glassy look
        border: "1px solid rgba(255, 255, 255, 0.18)",
      }}
    >
      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : isAdmin ? (
        <div style={{overflowY: 'scroll'}}>
          <h3 className='display-6 text-center'>View incoming messages from users who filled out the contact field</h3>
              <p className='text-center'>Once you have reviewed the message and taken actions, you can delete the message.</p>
          {messages.map((message) => (
            <div
              key={message.id}
              className="card my-3"
              style={{
                backgroundColor:
                  selectedMessage?.id === message.id
                    ? "rgba(255, 255, 255, 0.4)"
                    : "rgba(255, 255, 255, 0.2)",
                borderRadius: "10px",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Subtle shadow on cards
                transition: "background-color 0.3s, box-shadow 0.3s", // Smooth transition effects
              }}
            >
              <div className="card-body">
                <h5 className="card-title" style={{ color: "#222" }}>
                  {message.subject}
                </h5>
                <h6 className="card-subtitle mb-2" style={{ color: "#555" }}>
                  From: {message.firstName} {message.lastName}{" "}
                  <a
                    href={`mailto:${message.email}`}
                    style={{ color: "#007bff", textDecoration: "none" }}
                  >
                    {message.email}
                  </a>
                </h6>
                <p className="card-text" style={{ color: "#333" }}>
                  {message.message}
                </p>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteMessage(message.id)}
                  style={{
                    backgroundColor: "#dc3545",
                    borderColor: "#dc3545",
                  }}
                >
                  Delete Message
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center mt-5" style={{ color: "#333" }}>
          Only admins can view messages.
        </p>
      )}
    </div>
  );
}

export default ViewMessages;
