// Inline SVG icons – no heroicons dependency needed
const BellIcon = ({ className }: { className?: string }) => (<svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>);
const SearchIcon = ({ className }: { className?: string }) => (<svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" /></svg>);
const UserIcon = ({ className }: { className?: string }) => (<svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>);
const LogoutIcon = ({ className }: { className?: string }) => (<svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>);
const MenuIcon = ({ className }: { className?: string }) => (<svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>);
const XIcon = ({ className }: { className?: string }) => (<svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>);
// (GiftIcon removed – logo image is used instead)
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface NavbarProps {
  onMenuClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    setShowUserMenu(false);
    logout();
    navigate('/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/dashboard/donations?search=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50" style={{ borderBottom: '3px solid #d4a574' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex justify-between h-20">
          <div className="flex items-center space-x-4">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 transition-colors"
              style={{ color: '#d4a574' }}
            >
              <MenuIcon className="h-6 w-6" />
            </button>
            <motion.div
              className="flex items-center gap-3 cursor-pointer select-none"
              whileHover={{ scale: 1.03 }}
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                navigate('/dashboard');
              }}
            >
              <img
                src="/FeedaNeedLogo.png"
                alt="Feed A Need"
                className="w-10 h-10 rounded-xl object-cover"
                style={{ boxShadow: '0 2px 8px rgba(74,25,66,0.25)' }}
              />
              <div className="hidden sm:flex flex-col justify-center">
                <h1 className="text-xl font-black leading-none tracking-tight" style={{ color: '#4a1942' }}>
                  Feed<span style={{ color: '#d4a574' }}> A </span>Need
                </h1>
                <p className="text-xs font-bold uppercase tracking-widest mt-0.5" style={{ color: '#c9956a', opacity: 0.85 }}>
                  Donation Platform
                </p>
              </div>
            </motion.div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <AnimatePresence>
              {showSearch ? (
                <motion.form
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: '200px', opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="relative hidden sm:block"
                  onSubmit={handleSearch}
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full pl-3 pr-8 py-2 rounded-lg border focus:outline-none"
                    style={{ borderColor: '#d4a574', background: '#faf8f5' }}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowSearch(false)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                </motion.form>
              ) : null}
            </AnimatePresence>

            <motion.button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 transition-all duration-300 relative rounded-lg hover:bg-gray-50"
              style={{ color: '#4a1942' }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <SearchIcon className="h-6 w-6" />
            </motion.button>

            <motion.button
              onClick={() => navigate('/dashboard/notifications')}
              className="p-2 transition-all duration-300 relative rounded-lg hover:bg-gray-50"
              style={{ color: '#4a1942' }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <BellIcon className="h-6 w-6" />
              <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full" style={{ background: '#c62828' }}></span>
            </motion.button>

            <div className="relative">
              <motion.button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 transition-colors"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <div
                  className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ background: '#4a1942' }}
                >
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-bold" style={{ color: '#4a1942' }}>{user?.name}</p>
                  <p className="text-xs capitalize" style={{ color: '#666' }}>{user?.role}</p>
                </div>
              </motion.button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-2xl py-2 z-50"
                    style={{ border: '2px solid #d4a574' }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <button
                      onClick={() => {
                        navigate('/dashboard/settings');
                        setShowUserMenu(false);
                      }}
                      className="w-full px-4 py-3 text-left text-sm font-semibold transition-colors hover:bg-gray-50 flex items-center gap-2"
                      style={{ color: '#333' }}
                    >
                      <UserIcon className="w-4 h-4" />
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        navigate('/dashboard/settings');
                        setShowUserMenu(false);
                      }}
                      className="w-full px-4 py-3 text-left text-sm font-semibold transition-colors hover:bg-gray-50 flex items-center gap-2"
                      style={{ color: '#333' }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Settings
                    </button>
                    <hr className="my-2" style={{ borderColor: '#d4a574' }} />
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-left text-sm font-bold transition-all duration-300 flex items-center space-x-2"
                      style={{ color: '#c62828' }}
                    >
                      <LogoutIcon className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
