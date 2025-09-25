import React from 'react';
import { Link } from 'react-router-dom';

const Profile: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Profile</h1>
      <p>This is your profile page.</p>
      
      <div style={{ marginTop: '20px' }}>
        <Link to="/dashboard" style={{ marginRight: '10px' }}>← Back to Dashboard</Link>
        <Link to="/settings">Settings</Link>
      </div>
    </div>
  );
};

export default Profile;
