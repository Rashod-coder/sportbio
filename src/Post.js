import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from './Firebase/Firebase';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill's CSS for styling
import { FaPen } from 'react-icons/fa'; // Import the pencil icon
import { Analytics } from "@vercel/analytics/react";
import { FaTimes } from 'react-icons/fa';


function BlogPost() {
  const location = useLocation();
  const postId = location.pathname.split('/')[2];
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const navigate = useNavigate();
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const docRef = doc(db, 'blogs', postId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const postData = docSnap.data();
          setPost(postData);
          setEditedContent(postData.content);
        } else {
          console.error('No such document!');
        }
      } catch (error) {
        console.error('Error fetching document: ', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    if (currentUser && post && currentUser.uid === post.userID) {
      try {
        const docRef = doc(db, 'blogs', postId);
        await updateDoc(docRef, { content: editedContent });
        setPost(prev => ({ ...prev, content: editedContent }));
        setIsEditing(false);
      } catch (error) {
        console.error('Error updating document: ', error);
      }
    } else {
      console.error('User not authorized to edit this post.');
    }
  };

  const handleDelete = async () => {
    if (currentUser && post && currentUser.uid === post.userID) {
      const confirmDelete = window.confirm("Are you sure you want to delete this post?");
      
      if (confirmDelete) {
        try {
          const docRef = doc(db, 'blogs', postId);
          await deleteDoc(docRef);
          navigate('/blogs'); 
        } catch (error) {
          console.error('Error deleting document: ', error);
        }
      }
    } else {
      console.error('User not authorized to delete this post.');
    }
  };
  
  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedContent(post.content);
  };

  return (
    <div style={{ background: 'white', minHeight: '100vh', padding: '20px' }}>
      <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <style>
          {`
          .content img {
            max-width: 100%;
            height: auto;
          }

          .content iframe {
            width: 100%;
            height: auto;
            aspect-ratio: 16/9;
            border: none;
          }

          .content {
            overflow-x: auto;
            word-wrap: break-word;
          }
          `}
        </style>
        {isLoading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : post ? (
          <div>
            
                <FaTimes onClick={() => navigate('/blogs')} />
                
            <div className="row mb-4">
              <div className="col-md-12">
                <h1 className="text-center mt-5" style={{ wordWrap: 'break-word' }}>
                  {post.title}
                </h1>
              </div>
              <div className="col-md-12 text-center mt-3">
                <p style={{ wordWrap: 'break-word' }}>Quick Summary: {post.summary}</p>
              </div>
            </div>
            <div className='row mb-4'>
              {currentUser && currentUser.uid === post.userID && (
                <div className="col-sm-12 text-center">
                  <div className="d-flex flex-column flex-sm-row justify-content-center">
                    <button className="btn btn-primary me-sm-2 mb-2 mb-sm-0" onClick={handleEditClick} style={{maxWidth: '100%'}}>
                      <FaPen /> Edit Post
                    </button>
                    <button className="btn btn-danger ms-sm-2" onClick={handleDelete}>
                      Delete Post
                    </button>
                  </div>
                </div>
              )}
            </div>
            <hr />
            <div className="row">
              <div className="col-md-12">
                <h4>By: {post.author}</h4>
                {isEditing ? (
                  <div>
                    <ReactQuill
                      value={editedContent}
                      onChange={setEditedContent}
                      modules={{
                        toolbar: [
                          [{ header: [1, 2, false] }],
                          ['bold', 'italic', 'underline', 'strike'],
                          [{ list: 'ordered' }, { list: 'bullet' }],
                          ['link', 'image'], 
                          ['clean'],
                        ],
                      }}                      formats={editorFormats}
                      style={{ height: '400px' }}
                      
                    />
                    <button className="btn btn-success mt-5" onClick={handleSaveClick} >
                      Save
                    </button>
                    <button className="btn btn-secondary mt-5 ms-2" onClick={handleCancelClick}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="content" dangerouslySetInnerHTML={{ __html: post.content }}></div>
                  </div>
                )}
              </div>
              <div className="col-md-12 text-center">
                <button className="btn btn-primary" onClick={() => navigate('/blogs')}>
                  Back to Blogs
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '90vh' }}>
            <p className="text-center display-1">404 Page Not Found</p>
          </div>
        )}
      </div>
      <Analytics/>
    </div>
  );
}



const editorFormats = [
  'header', 'font', 'list', 'bullet', 'bold', 'italic', 'underline', 'color', 'background', 'align', 'link', 'image'
];

export default BlogPost;
