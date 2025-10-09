import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginResponse {
  user: {
    id: string;
    email: string;
    street: string;
  };
  token: string;
}

function Login() : React.JSX.Element {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL!;
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
    
    axios.post(`${API_URL}/api/users/login`, formData)
      .then(response => {
        console.log('Login successful:', response.data as LoginResponse)
        if (response.data.user.street) { //If user has their preferences set, redirect to dashboard; otherwise redirect to preferences
          navigate('/dashboard');
        } else {
          navigate('/preferences');
        }
      })
      .catch(error => {
        console.error('Login failed:', error.response?.data?.error || error.message);
        alert(`Login failed: ${error.response?.data?.error || 'Network error'}`);
      });
  }

  return (
    <div className="max-w-md mx-auto mt-12 p-5 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Login
      </h2>
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
          className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Login
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