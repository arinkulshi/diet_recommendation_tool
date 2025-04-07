import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

const Header: React.FC = () => {
  const { currentUser } = useContext(UserContext);
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-blue-600">
              NutriTracker
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium ${
                isActive('/') ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Search
            </Link>
            <Link
              to="/favorites"
              className={`text-sm font-medium ${
                isActive('/favorites') ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Favorites
            </Link>
          </nav>

          {/* User info */}
          <div className="hidden md:flex items-center">
            {currentUser ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">{currentUser.name}</span>
              </div>
            ) : (
              <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
                Sign In
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-gray-200">
            <nav className="flex flex-col space-y-3 py-2">
              <Link
                to="/"
                className={`px-2 py-1 text-base font-medium ${
                  isActive('/') ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Search
              </Link>
              <Link
                to="/favorites"
                className={`px-2 py-1 text-base font-medium ${
                  isActive('/favorites') ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Favorites
              </Link>
              {currentUser && (
                <div className="px-2 py-1 text-base font-medium text-gray-700">
                  {currentUser.name}
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;