import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface LoginFormData {
  email: string;
  password: string;
}

function Login() : React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login, authLoading, authError } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    login(formData.email, formData.password)
      .then(() => {
        if (!user?.street) {
          navigate('/preferences', { replace: true }); // If the user has not yet set their preferences, redirect to preferences
        } else {
          const from = location.state?.from?.pathname || '/dashboard'; // Otherwise, redirect to page that redirected the user to login or default to dashboard
          navigate(from, { replace: true });
        }
      })
      .catch(error => {
        console.error('Login failed:', error.message);
      });
  }

  return (
    <div className="max-w-md mx-auto mt-12 p-5 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Login
      </h2>
      
      {authError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {authError}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
          />
        </div>
        <button 
          type="submit" 
          disabled={authLoading}
          className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          {authLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className="text-center mt-4 text-gray-600">
        Don't have an account?{' '}
        <Link 
          to="/signup" 
          className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default Login;