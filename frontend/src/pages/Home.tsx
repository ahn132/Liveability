import React from 'react';
import { Link } from 'react-router-dom';

function Home() : React.JSX.Element {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Welcome to Liveability</h1>
      <p>Your journey starts here!</p>
      
      <div style={{ marginTop: '30px' }}>
        <Link 
          to="/login" 
          style={{ 
            margin: '10px', 
            padding: '10px 20px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '4px' 
          }}
        >
          Login
        </Link>
        <Link 
          to="/signup" 
          style={{ 
            margin: '10px', 
            padding: '10px 20px', 
            backgroundColor: '#28a745', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '4px' 
          }}
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Home;
