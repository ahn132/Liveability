import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navigation: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  function handleLogout() {
    logout();
  }

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
          {!isAuthenticated && location.pathname === '/' && (
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
          
          {isAuthenticated && (
            <>
              <span style={{ margin: '0 10px', color: '#6c757d' }}>
                Welcome, {user?.email}
              </span>
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
              <button 
                onClick={handleLogout}
                style={{ 
                  margin: '0 10px', 
                  padding: '8px 16px', 
                  backgroundColor: '#dc3545', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
