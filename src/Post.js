import React, { useEffect, useState } from 'react';
import { doc, getDoc } from "firebase/firestore";
import { db } from './Firebase/Firebase';
import { useLocation, useNavigate } from 'react-router-dom';

function BlogPost() {
    const location = useLocation();
    const postId = location.pathname.split("/")[2];
    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const docRef = doc(db, 'blogs', postId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setPost(docSnap.data());
                } else {
                    console.error("No such document!");
                }
            } catch (error) {
                console.error("Error fetching document: ", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPost();
    }, [postId]);

    return (
        <div style={{ background: 'white', minHeight: '100vh', padding: '20px' }}>
            <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                {isLoading ? (
                    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : post ? (
                    <div>
                        <div className="row mb-4">
                            <div className="col-md-12">
                                <h1 className="text-center mt-5" style={{ wordWrap: 'break-word' }}>{post.title}</h1>
                            </div>
                            <div className="col-md-12 text-center">
                                <button className="btn btn-primary" onClick={() => navigate('/blogs')}>Back to Blogs</button>
                            </div>
                            <div className="col-md-12 text-center mt-3">
                                <p style={{ wordWrap: 'break-word' }}>Quick Summary: {post.summary}</p>
                            </div>
                        </div>
                        <hr />
                        <div className="row">
                            <div className="col-md-12">
                                <h4>By: {post.author}</h4>
                                <div className="content" style={{ overflowX: 'auto', wordWrap: 'break-word' }} dangerouslySetInnerHTML={{ __html: post.content }}></div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '90vh' }}>

                    <p className="text-center display-1 justify-content-center">404 Page Not Found</p>
                   

                    </div>
                )}
            </div>
        </div>
    );
}

export default BlogPost;
