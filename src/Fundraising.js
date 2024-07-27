// src/BlogPage.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Fundraiser() {
  return (
    <div style={{ backgroundColor: '#f8f9fa', padding: '40px 0', borderBottom: '4px solid black'}}>
      <div
        className="container text-center"
        style={{
          minHeight: '100vh',
          padding: '40px 100px', // Increased horizontal padding
          backgroundColor: '#f8f9fa',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Add a subtle shadow
          marginBottom: '20px', // Add some spacing below the border
        }}
      >
        <h1 className="display-4 mt-4 text-primary font-weight-bold">
          Fundraising & Volunteering
        </h1>
        <hr className="my-4" />
        <h3 className="mb-4 font-weight-bold">
          FUNDRAISER LINK:{' '}
          <a
            href="https://americanredcross.donordrive.com/index.cfm?fuseaction=donorDrive.personalCampaign&participantID=8451"
            className="text-danger"
          >
            Blood Services Fundraiser
          </a>
        </h3>
        <p
          className="mt-3 text-secondary"
          style={{ fontSize: '1.1rem', lineHeight: '1.8' }} // Increase font size and line height
        >
          Blood donations play a crucial role in supporting athletes and
          community members alike. During sports injuries, rapid access to blood
          supplies can be life-saving, ensuring prompt treatment and recovery.
          Whether it’s replenishing blood lost during surgery or providing
          essential components for healing, donated blood is vital. By
          supporting the Red Cross Blood Services through Sports Injury Biology,
          you're not only helping athletes recover faster but also contributing
          to the overall health and resilience of our community. Click the link
          below and explore our fundraising page to learn how your contribution
          can make a vital difference in sports recovery and community health.{' '}
          <a
            href="https://americanredcross.donordrive.com/index.cfm?fuseaction=donorDrive.personalCampaign&participantID=8451"
            className="text-danger font-weight-bold"
          >
            Donate today!
          </a>{' '}
          and make every dollar count!
        </p>
        <p
          className="mt-5 text-secondary"
          style={{ fontSize: '1.1rem', lineHeight: '1.8' }}
        >
          We will also be hosting virtual events on the Red Cross platform
          Volunteer Connections. In order to attend, you must create a free
          Volunteer Connections account and sign up to attend for the event. You
          will get volunteer hours for attending!
        </p>
        <p
          className="mt-2 text-secondary"
          style={{ fontSize: '1.1rem', lineHeight: '1.8' }}
        >
          Click on this{' '}
          <a
            href="https://volunteerconnection.redcross.org/?nd=intake_content&entry_point_id=26&entry_point_type=global_entry_point"
            className="text-danger font-weight-bold"
          >
            link
          </a>{' '}
          to get started with the account creation process.
        </p>
        <h2 className="display-5 text-primary font-weight-bold mt-5">
          Volunteering Event Schedule
        </h2>
        <p
          className="text-secondary"
          style={{ fontSize: '1.1rem', lineHeight: '1.8' }}
        >
          Unfortunately, we don’t have any planned for now. Check back soon!
        </p>
      </div>
    </div>
  );
}

export default Fundraiser;
