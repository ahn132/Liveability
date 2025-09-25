import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard!</p>
      
      <div style={{ marginTop: '30px' }}>
        <h3>Quick Actions:</h3>
        <ul>
          <li><Link to="/profile">View Profile</Link></li>
          <li><Link to="/settings">Settings</Link></li>
          <li><Link to="/logout">Logout</Link></li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
