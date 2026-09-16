import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
const UserIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (<svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>);
const SearchIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (<svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" /></svg>);
const MailIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (<svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>);
const PhoneIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (<svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>);
import api from '../../services/api';

const Users = () => {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.getUsers();
      if (response.success && response.data) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      search === '' ||
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  const getRoleBadgeColors = (role: string) => {
    switch (role) {
      case 'admin':
        return { bg: '#4a1942', color: 'white' };
      case 'donor':
        return { bg: '#e8f5e9', color: '#1b5e20', border: '#66bb6a' };
      case 'recipient':
        return { bg: '#e3f2fd', color: '#0d47a1', border: '#42a5f5' };
      default:
        return { bg: '#faf8f5', color: '#333', border: '#d4a574' };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-4xl font-black" style={{ color: '#4a1942' }}>Users</h1>
        <p className="text-lg mt-1" style={{ color: '#666' }}>Manage all registered users on the platform</p>
      </div>

      <div className="card">
        <div className="flex items-center gap-2 mb-6">
          <SearchIcon className="h-5 w-5" style={{ color: '#4a1942' }} />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field flex-1"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="spinner"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '3px solid #d4a574' }}>
                  <th className="text-left py-4 px-4 font-black uppercase tracking-wide text-sm" style={{ color: '#4a1942' }}>
                    User
                  </th>
                  <th className="text-left py-4 px-4 font-black uppercase tracking-wide text-sm" style={{ color: '#4a1942' }}>
                    Contact
                  </th>
                  <th className="text-left py-4 px-4 font-black uppercase tracking-wide text-sm" style={{ color: '#4a1942' }}>
                    Role
                  </th>
                  <th className="text-left py-4 px-4 font-black uppercase tracking-wide text-sm" style={{ color: '#4a1942' }}>
                    Type
                  </th>
                  <th className="text-left py-4 px-4 font-black uppercase tracking-wide text-sm" style={{ color: '#4a1942' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, idx) => {
                  const roleColors = getRoleBadgeColors(user.role);
                  return (
                    <motion.tr
                      key={user.id}
                      className="transition-all duration-200 hover:bg-[#faf8f5]"
                      style={{ borderBottom: '2px solid #faf8f5' }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                    >
                      <td className="py-5 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="h-12 w-12 rounded-full flex items-center justify-center font-black text-white text-lg"
                            style={{ background: '#4a1942' }}
                          >
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-base" style={{ color: '#4a1942' }}>
                              {user.name}
                            </p>
                            <p className="text-sm" style={{ color: '#666' }}>
                              ID: {user.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <MailIcon className="w-4 h-4" style={{ color: '#4a1942' }} />
                            <span style={{ color: '#333' }}>{user.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <PhoneIcon className="w-4 h-4" style={{ color: '#4a1942' }} />
                            <span style={{ color: '#333' }}>{user.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-4">
                        <span
                          className="px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wide inline-block"
                          style={{
                            background: roleColors.bg,
                            color: roleColors.color,
                            border: roleColors.border ? `2px solid ${roleColors.border}` : 'none'
                          }}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="py-5 px-4">
                        <span className="badge badge-default capitalize">
                          {user.type}
                        </span>
                      </td>
                      <td className="py-5 px-4">
                        <motion.button
                          className="font-bold text-sm px-4 py-2 rounded-lg transition-all duration-200"
                          style={{ color: '#4a1942', border: '2px solid transparent' }}
                          whileHover={{
                            borderColor: '#d4a574',
                            background: '#faf8f5'
                          }}
                          whileTap={{ scale: 0.95 }}
                        >
                          View Details
                        </motion.button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <div className="text-center py-16">
                <UserIcon className="w-24 h-24 mx-auto mb-6 opacity-20" style={{ color: '#999' }} />
                <p className="text-xl font-bold mb-2" style={{ color: '#4a1942' }}>
                  No users found
                </p>
                <p style={{ color: '#666' }}>
                  {search ? 'Try adjusting your search criteria' : 'No users registered yet'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          className="card text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: '#666' }}>
            Total Users
          </p>
          <p className="text-5xl font-black" style={{ color: '#4a1942' }}>
            {users.length}
          </p>
        </motion.div>
        <motion.div
          className="card text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: '#1b5e20' }}>
            Donors
          </p>
          <p className="text-5xl font-black" style={{ color: '#2d7d31' }}>
            {users.filter(u => u.role === 'donor').length}
          </p>
        </motion.div>
        <motion.div
          className="card text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: '#0d47a1' }}>
            Recipients
          </p>
          <p className="text-5xl font-black" style={{ color: '#0d47a1' }}>
            {users.filter(u => u.role === 'recipient').length}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Users;
