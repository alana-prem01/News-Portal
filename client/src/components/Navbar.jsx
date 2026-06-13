import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, User } from 'lucide-react';

const Navbar = () => {
  const categories = ['World', 'Business', 'Technology', 'Science', 'Health', 'Sports', 'Entertainment'];

  return (
    <header className="bg-white border-b border-gray-200">
      {/* Top bar */}
      <div className="bg-[var(--color-brand-red)] text-white">
        <div className="max-w-7xl mx-auto px-4 h-12 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-2xl font-bold tracking-tight">
              BBC NEWS
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center bg-white/20 px-3 py-1.5 rounded text-sm hover:bg-white/30 cursor-pointer transition-colors">
              <User className="w-4 h-4 mr-2" />
              <Link to="/admin/login">Sign in</Link>
            </div>
            <button className="p-1 hover:bg-white/20 rounded transition-colors">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Categories nav */}
      <div className="max-w-7xl mx-auto px-4">
        <nav className="flex items-center gap-6 py-3 overflow-x-auto no-scrollbar">
          <Link to="/" className="text-[var(--color-brand-text)] font-semibold whitespace-nowrap hover:text-[var(--color-brand-red)] transition-colors border-b-2 border-transparent hover:border-[var(--color-brand-red)]">Home</Link>
          {categories.map((category) => (
            <Link
              key={category}
              to={`/category/${category.toLowerCase()}`}
              className="text-gray-600 font-medium whitespace-nowrap hover:text-[var(--color-brand-red)] transition-colors"
            >
              {category}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
