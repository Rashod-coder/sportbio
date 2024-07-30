import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import logo from './givenLogo.JPG';
import { Analytics } from "@vercel/analytics/react";
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from './Firebase/Firebase'; 
import './Home.css'; 

function Home() {
  const [latestArticle, setLatestArticle] = useState(null);
  const [latestArticleId, setLatestArticleId] = useState(null);

  useEffect(() => {
    const fetchLatestArticle = async () => {
      try {
        const articlesRef = collection(db, 'blogs');
        const q = query(articlesRef, orderBy('createdAt', 'desc'), limit(1));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          setLatestArticle(doc.data());
          setLatestArticleId(doc.id); 
        }
      } catch (error) {
        console.error("Error fetching latest article: ", error);
      }
    };

    fetchLatestArticle();
  }, []);

  return (
    <div>
      <div style={{
  minHeight: '10vh',
  backgroundColor: '#fff',
  borderBottom: '1px solid #000',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // 3D shadow effect
  padding: '20px 0'
}}>
  <div className='container py-4'>
    <div className="row align-items-center">
      <div className="col-md-6">
        <h1 className='display-4 font-weight-bold' style={{
          color: '#000',
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)', // Subtle text shadow
          marginBottom: '10px'
        }}>
          Our Latest Article:
        </h1>
      </div>
      <div className="col-md-6 text-md-right">
        {latestArticle && latestArticleId ? (
          <h2 className='display-5' style={{
            color: '#000',
            textDecoration: 'underline',
            textDecorationColor: '#007bff', // Modern underline color
            textDecorationThickness: '2px',
            textDecorationStyle: 'solid'
          }}>
            <a href={`/blogs/${latestArticleId}`} style={{
              color: '#000',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}>
              {latestArticle.title}
            </a>
          </h2>
        ) : (
          <p style={{
            fontSize: '20px',
            color: '#666'
          }}>Fetching Article</p>
        )}
      </div>
    </div>
  </div>
</div>
      <div className="container mt-4" style={{ minHeight: '100vh' }}>
        <div className="row align-items-center mb-4">
          <div className="col-md-12 text-center">
            <img src={logo} alt="Logo" className="img-fluid" style={{ maxWidth: '100%', height: 'auto' }} />
          </div>
        </div>
        <div className="row">
          <div className="col text-center">
            <h1 className='mb-5' style={{ color: '#000' }}>From Injury to Recovery: The Biological Journey</h1>
            <a href="#footer" className="btn btn-dark btn-lg" style={{ borderRadius: '30px', textDecoration: 'none', marginRight: '15px', fontSize: '20px' }}>
              Contact Us
            </a>
            <a href="https://docs.google.com/forms/d/e/1FAIpQLSc4jBsKcCvODEAQm8GruF1sus1oIqEXOqbXQwr3f4AKGM4AlQ/viewform" className="btn btn-dark btn-lg" style={{ borderRadius: '30px', textDecoration: 'none', marginRight: '15px', fontSize: '20px' }}>
              Join the Team!
            </a>
          </div>
        </div>
      </div>
      <div id='about' className='mt-4' style={{ backgroundColor: '#fff', borderTop: '3px solid #000', minHeight: '100vh', padding: '40px 0' }}>
        <div className='container'>
          <h1 className='text-center display-3 mb-4' style={{ color: '#000' }}>About Us</h1>
          <hr style={{ borderTop: '1px solid #000', margin: '20px 0' }} />
          <h2 className='display-4' style={{ color: '#000' }}>
            Our Mission:
            <h3 className='mt-3' style={{ color: '#333' }}>Bridging the gap between athletes, medical professionals, and the general public by providing clear, accessible information on the biological mechanisms of sports injuries as well as the underlying human body systems.</h3>
          </h2>
          <p className='mt-4' style={{ fontSize: '20px', color: '#333' }}>
            This site is dedicated to offering in-depth articles (on our <a href='/blogs' style={{ color: '#007bff' }}>blog page</a>, which you can access by clicking on the link), expert insights, and practical advice to help you navigate the complexities of sports-related injuries. Whether you’re an athlete seeking to understand your body, a coach looking for prevention tips, a medical professional wanting to stay informed, or just an interested individual, we’ve got you covered. We also plan to feature guest articles from industry experts, volunteer opportunities to get involved in organizations like the Red Cross, and other events focused on injury awareness and prevention.
          </p>
          <p className='mt-4' style={{ fontSize: '20px', color: '#333' }}>
            We will be trying our best to upload a new article every week!
          </p>
        </div>
      </div>
      <Analytics />
    </div>
  );
}

export default Home;
