import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Public Pages
import Home from './pages/public/Home';
import CategoryPage from './pages/public/CategoryPage';
import SingleFeedPage from './pages/public/SingleFeedPage';

// Admin Pages
import AdminLayout from './components/AdminLayout';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import PostEditor from './pages/admin/PostEditor';
import Profile from './pages/admin/Profile';

const App = () => {
  return (
    <Routes>
      {/* Admin Routes without Navbar/Footer */}
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="post/:id" element={<PostEditor />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Public Routes with Navbar/Footer */}
      <Route path="*" element={
        <div className="min-h-screen flex flex-col bg-[var(--color-brand-gray)] font-sans">
          <Navbar />
          <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/category/:category" element={<CategoryPage />} />
              <Route path="/post/:id" element={<SingleFeedPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      } />
    </Routes>
  );
};

export default App;
