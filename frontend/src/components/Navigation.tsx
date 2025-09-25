import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
  const location = useLocation();

  return (
    <nav style={{ 
      backgroundColor: '#f8f9fa', 
      padding: '10px 20px', 
      borderBottom: '1px solid #dee2e6',
      marginBottom: '20px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}>
          Liveability
        </Link>
        
        <div>
          {location.pathname === '/' && (
            <>
              <Link 
                to="/login" 
                style={{ 
                  margin: '0 10px', 
                  padding: '8px 16px', 
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
                  margin: '0 10px', 
                  padding: '8px 16px', 
                  backgroundColor: '#28a745', 
                  color: 'white', 
                  textDecoration: 'none', 
                  borderRadius: '4px' 
                }}
              >
                Sign Up
              </Link>
            </>
          )}
          
          {(location.pathname === '/dashboard' || location.pathname === '/profile') && (
            <>
              <Link 
                to="/dashboard" 
                style={{ 
                  margin: '0 10px', 
                  padding: '8px 16px', 
                  textDecoration: 'none', 
                  color: location.pathname === '/dashboard' ? '#007bff' : '#6c757d'
                }}
              >
                Dashboard
              </Link>
              <Link 
                to="/profile" 
                style={{ 
                  margin: '0 10px', 
                  padding: '8px 16px', 
                  textDecoration: 'none', 
                  color: location.pathname === '/profile' ? '#007bff' : '#6c757d'
                }}
              >
                Profile
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
