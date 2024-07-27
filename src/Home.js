// src/BlogPage.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported
import logo from './givenLogo.JPG';

function Home() {
  // Scroll to footer function
  

  return (
    <div>
    <div className="container mt-4" style={{ minHeight: '100vh' }}>
      <div className="row align-items-center">
        <div className="col-md-6 col-sm-12 col-xs-12 text-sm-center text-md-left">
          
        </div>
        <div className="col-md-12 text-sm-center text-md-right">
          <img src={logo} alt="Logo" className="img-fluid" style={{ maxWidth: '100%', height: 'auto' }} />
        </div>
      </div>
      <div className="row">
        <div className="col text-center">
          <h1 className='mb-5'>From Injury to Recovery: The Biological Journey</h1>
          <a href="#footer" className="btn btn-primary btn-lg" style={{ borderRadius: '40px', textDecoration: 'none', marginRight: '25px', fontSize: '25px' }}>
            Contact Us
          </a>
          <a href="https://docs.google.com/forms/d/e/1FAIpQLSc4jBsKcCvODEAQm8GruF1sus1oIqEXOqbXQwr3f4AKGM4AlQ/viewform" className="btn btn-primary btn-lg" style={{ borderRadius: '40px', textDecoration: 'none', marginRight: '25px', fontSize: '25px' }}>
            Join the team!
          </a>
        </div>
      </div>
    </div>
    <div id='about' style={{backgroundColor: '#f2f2f2'}}>
      <div className='container' style={{minHeight: '100vh'}}>
        <h1 className='text-center display-2 mb-3 mt-2'>About Us</h1>
        <hr/>
        <h2 className='display-4'>Our mission<h3>Bridging the gap between athletes, medical professionals, and the general public by providing clear, accessible information on the biological mechanisms of sports injuries as well as the underlying human body systems.</h3></h2>
        <p className='mt-5' style={{fontSize: '23px'}}>This site is dedicated to offering in-depth articles (on our <a href='/blogs'>blog page</a>, which you can access by clicking on the link), expert insights, and practical advice to help you navigate the complexities of sports-related injuries. Whether you’re an athlete seeking to understand your body, a coach looking for prevention tips, a medical professional wanting to stay informed, or just an interested individual, we’ve got you covered. We also plan to feature guest articles from industry experts, volunteer opportunities to get involved in organizations like the Red Cross, and other events focused on injury awareness and prevention.</p>
        <p className='mt-5' style={{fontSize: '23px'}}>We will be trying our best to upload a new article every week!</p>
      </div>
    </div>
    </div>
  );
}

export default Home;
