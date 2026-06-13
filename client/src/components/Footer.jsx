import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[var(--color-brand-dark)] text-white mt-12 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center border-b border-gray-700 pb-8 mb-8">
          <div className="text-2xl font-bold tracking-tight mb-4 md:mb-0">
            BBC NEWS
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-300 transition-colors">Terms of Use</a>
            <a href="#" className="hover:text-gray-300 transition-colors">About the BBC</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Cookies</a>
          </div>
        </div>
        <div className="text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} BBC. The BBC is not responsible for the content of external sites.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
