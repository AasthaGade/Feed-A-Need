const HomeIcon = ({ className }: { className?: string }) => (<svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>);
const GiftIcon = ({ className }: { className?: string }) => (<svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13H8.5a3.5 3.5 0 010-7C10 1 12 5 12 5zm0 0h3.5a3.5 3.5 0 000-7C14 1 12 5 12 5zm-7 4h14M5 12v9h14v-9" /></svg>);
const ChartBarIcon = ({ className }: { className?: string }) => (<svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>);
const UsersIcon = ({ className }: { className?: string }) => (<svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>);
const CogIcon = ({ className }: { className?: string }) => (<svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>);
const XIcon = ({ className }: { className?: string }) => (<svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>);
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const sections = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, roles: ['admin', 'donor', 'recipient'] },
    { name: 'Donations', href: '/dashboard/donations', icon: GiftIcon, roles: ['admin', 'donor', 'recipient'] },
    { name: 'Analytics', href: '/dashboard/analytics', icon: ChartBarIcon, roles: ['admin'] },
    { name: 'Users', href: '/dashboard/users', icon: UsersIcon, roles: ['admin'] },
    { name: 'Settings', href: '/dashboard/settings', icon: CogIcon, roles: ['admin', 'donor', 'recipient'] },
  ];

  const filteredSections = sections.filter((section) =>
    section.roles.includes(user?.role || 'donor')
  );

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between h-20 px-6" style={{ borderBottom: '3px solid #d4a574' }}>
        <h2 className="text-2xl font-black" style={{ color: '#4a1942' }}>Menu</h2>
        <button
          onClick={onClose}
          className="lg:hidden p-2 rounded-lg transition-all duration-200 hover:bg-gray-100"
          style={{ color: '#4a1942' }}
        >
          <XIcon className="h-6 w-6" />
        </button>
      </div>

      <nav className="mt-6 px-4 space-y-2">
        {filteredSections.map((section) => {
          const isActive = location.pathname === section.href;
          return (
            <motion.button
              key={section.name}
              onClick={() => {
                navigate(section.href);
                onClose?.();
              }}
              className={`flex items-center w-full px-5 py-4 text-sm font-bold rounded-xl transition-all duration-200 ${isActive ? 'shadow-lg' : ''}`}
              style={{
                background: isActive ? '#4a1942' : 'white',
                color: isActive ? 'white' : '#333',
                border: isActive ? '2px solid #4a1942' : '2px solid transparent',
              }}
              whileHover={{
                x: isActive ? 0 : 4,
                background: isActive ? '#4a1942' : '#faf8f5',
                borderColor: isActive ? '#4a1942' : '#d4a574',
                color: isActive ? 'white' : '#4a1942',
              }}
              transition={{ duration: 0.2 }}
              whileTap={{ scale: 0.98 }}
            >
              <section.icon className="h-5 w-5 mr-3" />
              <span className="uppercase tracking-wide text-xs">{section.name}</span>
            </motion.button>
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4" style={{ borderTop: '2px solid #d4a574' }}>
        <div className="p-5 rounded-xl" style={{ background: '#f0ebe5', border: '2px solid #d4a574' }}>
          <p className="text-xs font-bold mb-1 uppercase tracking-wide" style={{ color: '#4a1942' }}>
            Need Help?
          </p>
          <p className="text-xs mb-3" style={{ color: '#666' }}>
            Check our documentation for more info
          </p>
          <motion.button
            onClick={() => {
              navigate('/dashboard/documentation');
              onClose?.();
            }}
            className="w-full px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all duration-200"
            style={{ background: 'white', color: '#4a1942', border: '2px solid #d4a574' }}
            whileHover={{ background: '#4a1942', color: 'white', scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            View Docs
          </motion.button>
        </div>
      </div>
    </>
  );

  // Desktop sidebar
  if (!onClose) {
    return (
      <div className="hidden lg:flex lg:flex-col lg:w-72 bg-white relative" style={{ borderRight: '3px solid #d4a574' }}>
        {sidebarContent}
      </div>
    );
  }

  // Mobile sidebar
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-y-0 left-0 w-72 bg-white z-50 lg:hidden"
            style={{ borderRight: '3px solid #d4a574' }}
            initial={{ x: -288 }}
            animate={{ x: 0 }}
            exit={{ x: -288 }}
            transition={{ type: 'tween', duration: 0.2 }}
          >
            {sidebarContent}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
