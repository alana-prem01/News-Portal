import React, { useState, useContext, useEffect } from 'react';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  
  const [mode, setMode] = useState('initial'); // 'initial' | 'otp_sent'
  const [passwords, setPasswords] = useState({
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/auth/profile');
        setProfileData(data);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSendOTP = async () => {
    setMessage({ type: '', text: '' });
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email: profileData.email });
      setMessage({ type: 'success', text: 'OTP sent to your email.' });
      setMode('otp_sent');
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to send OTP' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    setLoading(true);
    try {
      await api.put('/auth/reset-password', {
        email: profileData.email,
        otp: passwords.otp,
        newPassword: passwords.newPassword
      });
      setMessage({ type: 'success', text: 'Password updated successfully' });
      setPasswords({ otp: '', newPassword: '', confirmPassword: '' });
      setMode('initial');
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update password' });
    } finally {
      setLoading(false);
    }
  };

  if (!profileData) return <div>Loading profile...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">My Profile</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">Name</label>
            <div className="mt-1 text-lg font-semibold text-gray-900">{profileData.name}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Email Address</label>
            <div className="mt-1 text-lg text-gray-900">{profileData.email}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Role</label>
            <span className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {profileData.role}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold mb-6 text-gray-800">Change Password</h2>
        
        {message.text && (
          <div className={`mb-6 p-3 rounded text-sm ${message.type === 'error' ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
            {message.text}
          </div>
        )}

        {mode === 'initial' ? (
          <div>
            <p className="text-sm text-gray-600 mb-4">
              To change your password, we need to send a 6-digit OTP to your registered email address.
            </p>
            <button
              onClick={handleSendOTP}
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--color-brand-red)] hover:bg-red-800 focus:outline-none disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send OTP to Email'}
            </button>
          </div>
        ) : (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">6-Digit OTP</label>
              <input
                type="text"
                name="otp"
                maxLength="6"
                required
                value={passwords.otp}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[var(--color-brand-red)] focus:border-[var(--color-brand-red)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                name="newPassword"
                required
                value={passwords.newPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[var(--color-brand-red)] focus:border-[var(--color-brand-red)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={passwords.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[var(--color-brand-red)] focus:border-[var(--color-brand-red)]"
              />
            </div>
            
            <div className="pt-2 flex justify-between">
              <button
                type="button"
                onClick={() => { setMode('initial'); setMessage({ type: '', text: '' }); }}
                className="text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--color-brand-red)] hover:bg-red-800 focus:outline-none disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
