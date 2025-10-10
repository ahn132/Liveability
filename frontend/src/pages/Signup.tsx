import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

function Signup(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login, authLoading, authError } = useAuth();
  const [formData, setFormData] = useState<SignupFormData>({  
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [signupError, setSignupError] = useState<string>('');


  // Handle input changes
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear errors when user starts typing
    if (signupError) setSignupError('');
  }

  // Handle form submission
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setSignupError('Passwords do not match');
      return;
    }

    setSignupError('');

    // First create the account
    api.post('/api/users/register', {
      email: formData.email,
      password: formData.password,
    })
    .then(() => {
      // Then automatically log the user in
      return login(formData.email, formData.password);
    })
    .then(() => {
      if (!user?.street) {
        navigate('/preferences', { replace: true }); // If the user has not yet set their preferences, redirect to preferences
      } else {
        const from = location.state?.from?.pathname || '/dashboard'; // Otherwise, redirect to page that redirected the user to signup or default to dashboard
        navigate(from, { replace: true });
      }
    })
    .catch(error => {
      console.error('Signup failed:', error);
      if (error.response?.data?.error) {
        setSignupError(error.response.data.error);
      } else {
        setSignupError('Signup failed. Please try again.');
      }
    });
  }

  return (
    <div className="max-w-md mx-auto mt-12 p-5 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Sign Up
      </h2>
      
      {signupError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {signupError}
        </div>
      )}
      
      {authError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
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
            disabled={authLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
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
            disabled={authLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>
        
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password:
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            disabled={authLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>
        
        <button 
          type="submit" 
          disabled={authLoading}
          className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          {authLoading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>
      
      <p className="text-center mt-4 text-gray-600">
        Already have an account?{' '}
        <Link 
          to="/login" 
          className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
        >
          Login
        </Link>
      </p>
    </div>
  );
};

export default Signup;
