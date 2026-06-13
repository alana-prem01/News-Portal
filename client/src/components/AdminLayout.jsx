import React, { useContext } from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, FileText, User, LogOut } from 'lucide-react';

const AdminLayout = () => {
  const { user, loading, logout } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return <div className="h-screen flex items-center justify-center">Loading admin...</div>;
  if (!user) return <Navigate to="/admin/login" replace />;

  const isActive = (path) => location.pathname === path ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white';

  return (
    <div className="min-h-screen flex bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white tracking-wider">ADMIN PANEL</h2>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link to="/admin" className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive('/admin')}`}>
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </Link>
          <Link to="/admin/post/new" className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive('/admin/post/new')}`}>
            <FileText className="w-5 h-5 mr-3" />
            New Post
          </Link>
          <Link to="/admin/profile" className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive('/admin/profile')}`}>
            <User className="w-5 h-5 mr-3" />
            Profile
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={logout}
            className="flex items-center w-full px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-8">
          <h1 className="text-xl font-semibold text-gray-800 capitalize">
            {location.pathname === '/admin' ? 'Dashboard' : location.pathname.split('/').pop().replace('-', ' ')}
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Welcome, {user.name}</span>
            <Link to="/" className="text-sm text-[var(--color-brand-red)] hover:underline">View Site</Link>
          </div>
        </header>
        <div className="p-8 flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
