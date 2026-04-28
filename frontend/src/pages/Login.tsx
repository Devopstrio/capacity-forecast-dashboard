import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/slices/authSlice';
import axios from 'axios';
import { Lock, Mail } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/v1/auth/login', 
        new URLSearchParams({ username: email, password: password }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
      dispatch(setCredentials({ token: response.data.access_token, user: { email } }));
    } catch (error) {
      alert('Login failed. Use admin@devopstrio.com / admin123');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950">
      <div className="bg-slate-900 p-10 rounded-3xl shadow-2xl border border-slate-800 w-full max-w-md">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-slate-400">Sign in to Capacity Forecast Dashboard</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3 text-slate-500 w-5 h-5" />
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-sky-500 outline-none transition"
                placeholder="admin@devopstrio.com"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3 text-slate-500 w-5 h-5" />
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-sky-500 outline-none transition"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          <button 
            type="submit"
            className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-sky-900/20 transition transform hover:-translate-y-1"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
