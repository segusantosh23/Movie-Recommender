import React, { useState, useContext, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import Logo from './Logo';

const Navbar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const location = useLocation();
  const { pathname } = location;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileMenuRef]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search/${searchQuery.trim()}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false); // Close menu on search
    }
  };
  
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleLogout = () => {
    authContext?.logout();
    navigate('/');
    setIsProfileMenuOpen(false);
    closeMobileMenu();
  };

  const navLinks = [
    { to: '/home', label: 'Home' },
    { to: '/trending', label: 'Trending' },
    { to: '/ai-recommender', label: 'AI Recommender' },
    { to: '/liked', label: 'Liked' },
    { to: '/watchlist', label: 'Watchlist' },
  ];

  const getLinkClassName = (path: string, baseClasses: string) => {
    const activeClasses = 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow-lg';
    const inactiveClasses = 'text-gray-300 hover:bg-gray-700 hover:text-white';
    return `${baseClasses} ${pathname === path ? activeClasses : inactiveClasses}`;
  };

  return (
    <nav className="bg-gray-800/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left side: Logo and Desktop Nav */}
          <div className="flex items-center space-x-8">
            <Logo onClick={closeMobileMenu} />
            <div className="hidden lg:flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to} className={getLinkClassName(link.to, 'px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 whitespace-nowrap')}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side: Search, Auth, and Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearch} className="hidden sm:block relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies..."
                className="bg-gray-700 text-white placeholder-gray-400 rounded-full py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-80 lg:w-[36rem] transition-all duration-300"
              />
              <button type="submit" className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white" aria-label="Search">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
            <div className="hidden lg:flex items-center">
              {authContext?.user ? (
                <div className="relative" ref={profileMenuRef}>
                  <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center space-x-2 text-white p-1 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-sm">
                      {authContext.user.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium hidden lg:block">{authContext.user.username}</span>
                    <svg className="w-4 h-4 text-gray-400 hidden lg:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </button>
                  {isProfileMenuOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabIndex={-1}>
                      <Link to="/profile" onClick={() => setIsProfileMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white" role="menuitem" tabIndex={-1}>
                        Your Profile
                      </Link>
                      <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white" role="menuitem" tabIndex={-1}>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md text-sm">Login</Link>
              )}
            </div>
             {/* Mobile menu button */}
            <div className="lg:hidden flex items-center">
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} type="button" className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded={isMobileMenuOpen}>
                <span className="sr-only">Open main menu</span>
                <svg className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                </button>
            </div>
          </div>
        </div>
      </div>

       {/* Mobile menu, show/hide based on menu state. */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} lg:hidden`} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
                <Link key={link.to} to={link.to} onClick={closeMobileMenu} className={getLinkClassName(link.to, 'block px-3 py-2 rounded-md text-base font-medium transition-all duration-300')}>
                    {link.label}
                </Link>
            ))}
             {authContext?.user && (
                 <Link to="/profile" onClick={closeMobileMenu} className={getLinkClassName('/profile', 'block px-3 py-2 rounded-md text-base font-medium transition-all duration-300')}>
                    Your Profile
                </Link>
            )}
        </div>
        <div className="pt-4 pb-3 border-t border-gray-700">
          <div className="px-5 sm:px-3 mb-3">
             <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies..."
                className="bg-gray-700 text-white placeholder-gray-400 rounded-full py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
              <button type="submit" className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-white" aria-label="Search">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>
          {authContext?.user ? (
            <div className="flex items-center px-5 sm:px-3">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center font-bold">
                    {authContext.user.username.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium leading-none text-white">{authContext.user.username}</div>
              </div>
              <button onClick={handleLogout} className="ml-auto bg-gray-700 flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                <span className="sr-only">Logout</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="px-2 sm:px-3">
                <Link to="/" onClick={closeMobileMenu} className="block w-full text-left bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-md text-base">Login</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;