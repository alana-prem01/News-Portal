import React, { useState, useContext } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
  const [mode, setMode] = useState('login'); // 'login' | 'forgot' | 'reset'
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loadingReq, setLoadingReq] = useState(false);
  
  const { login, user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  if (loading) return null;
  if (user) return <Navigate to="/admin" replace />;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoadingReq(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data.token, { _id: data._id, name: data.name, email: data.email, role: data.role });
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoadingReq(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoadingReq(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSuccessMsg('OTP sent to your email.');
      setMode('reset');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoadingReq(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoadingReq(true);
    try {
      await api.put('/auth/reset-password', { email, otp, newPassword });
      setSuccessMsg('Password reset successful! You can now log in.');
      setMode('login');
      setPassword('');
      setOtp('');
      setNewPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoadingReq(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full space-y-8 bg-white p-10 shadow-lg border border-gray-100 rounded-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {mode === 'login' ? 'Admin Portal' : mode === 'forgot' ? 'Forgot Password' : 'Reset Password'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {mode === 'login' && 'Sign in to manage news posts'}
            {mode === 'forgot' && 'Enter your email to receive an OTP'}
            {mode === 'reset' && 'Enter the OTP and your new password'}
          </p>
        </div>
        
        {error && <div className="bg-red-50 text-red-500 p-3 rounded text-sm text-center border border-red-100">{error}</div>}
        {successMsg && <div className="bg-green-50 text-green-600 p-3 rounded text-sm text-center border border-green-100">{successMsg}</div>}
        
        {mode === 'login' && (
          <form className="mt-8 space-y-6" onSubmit={handleLoginSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[var(--color-brand-red)] focus:border-[var(--color-brand-red)] focus:z-10 sm:text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[var(--color-brand-red)] focus:border-[var(--color-brand-red)] focus:z-10 sm:text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => { setMode('forgot'); setError(''); setSuccessMsg(''); }}
                className="text-sm font-medium text-[var(--color-brand-red)] hover:underline focus:outline-none"
              >
                Forgot your password?
              </button>
            </div>

            <div>
              <button
                type="submit"
                disabled={loadingReq}
                className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[var(--color-brand-red)] hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-brand-red)] transition-colors disabled:opacity-50"
              >
                {loadingReq ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        )}

        {mode === 'forgot' && (
          <form className="mt-8 space-y-6" onSubmit={handleForgotSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[var(--color-brand-red)] focus:border-[var(--color-brand-red)] focus:z-10 sm:text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }}
                className="text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                Back to Sign in
              </button>
              <button
                type="submit"
                disabled={loadingReq}
                className="py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[var(--color-brand-red)] hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-brand-red)] transition-colors disabled:opacity-50"
              >
                {loadingReq ? 'Sending...' : 'Send OTP'}
              </button>
            </div>
          </form>
        )}

        {mode === 'reset' && (
          <form className="mt-8 space-y-6" onSubmit={handleResetSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  disabled
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 bg-gray-50 text-gray-500 rounded-md sm:text-sm"
                  value={email}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">6-Digit OTP</label>
                <input
                  type="text"
                  required
                  maxLength="6"
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[var(--color-brand-red)] focus:border-[var(--color-brand-red)] focus:z-10 sm:text-sm"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[var(--color-brand-red)] focus:border-[var(--color-brand-red)] focus:z-10 sm:text-sm"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }}
                className="text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loadingReq}
                className="py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[var(--color-brand-red)] hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-brand-red)] transition-colors disabled:opacity-50"
              >
                {loadingReq ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

export default Login;
