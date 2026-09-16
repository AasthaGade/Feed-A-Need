import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { useDonations } from '../../hooks/useDonations';
import { useNavigate } from 'react-router-dom';

// ─── Inline SVG icons ────────────────────────────────────────────────────────
const GiftIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13H8.5a3.5 3.5 0 010-7C10 1 12 5 12 5zm0 0h3.5a3.5 3.5 0 000-7C14 1 12 5 12 5zm-7 4h14M5 12v9h14v-9" />
  </svg>
);
const ClockIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const CheckCircleIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const ChartBarIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);
const TrendingUpIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);
const CurrencyDollarIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// ─── Status badge style map ────────────────────────────────────────────────
const statusStyle: Record<string, { bg: string; color: string; border: string }> = {
  pending: { bg: '#fff3e0', color: '#e65100', border: '#ffb74d' },
  approved: { bg: '#e8f5e9', color: '#1b5e20', border: '#66bb6a' },
  completed: { bg: '#f5f5f5', color: '#424242', border: '#9e9e9e' },
  cancelled: { bg: '#ffebee', color: '#b71c1c', border: '#ef9a9a' },
};

const Dashboard = () => {
  const { user } = useAuth();
  const { donations, loading } = useDonations();
  const navigate = useNavigate();

  const stats = {
    totalDonations: donations.length,
    pending: donations.filter(d => d.status === 'pending').length,
    approved: donations.filter(d => d.status === 'approved').length,
    completed: donations.filter(d => d.status === 'completed').length,
  };

  const recentDonations = donations.slice(0, 5);

  const statCards = [
    { label: 'Total Donations', value: stats.totalDonations, Icon: ChartBarIcon, color: '#4a1942' },
    { label: 'Pending', value: stats.pending, Icon: ClockIcon, color: '#e65100' },
    { label: 'Active', value: stats.approved, Icon: CheckCircleIcon, color: '#2d7d31' },
    { label: 'Completed', value: stats.completed, Icon: TrendingUpIcon, color: '#0d47a1' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-10"
    >
      {/* Page Header */}
      <div className="text-center">
        <motion.h2
          className="text-5xl font-black mb-3"
          style={{ color: '#4a1942' }}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {user?.role === 'admin'
            ? 'Admin Dashboard'
            : user?.role === 'donor'
              ? 'Donor Dashboard'
              : 'Recipient Dashboard'}
        </motion.h2>
        <motion.p
          className="text-xl"
          style={{ color: '#666' }}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {user?.role === 'admin'
            ? 'Monitor and manage all platform activities'
            : user?.role === 'donor'
              ? 'Make a difference by sharing what you have'
              : 'Find and request available donations'}
        </motion.p>
        <motion.p
          className="text-sm mt-1 font-semibold"
          style={{ color: '#d4a574' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Welcome back, {user?.name} 👋
        </motion.p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <motion.div
            key={idx}
            className="stat-card"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 + idx * 0.1 }}
          >
            <stat.Icon className="w-12 h-12 mb-3 mx-auto" style={{ color: stat.color }} />
            <div className="text-xs uppercase tracking-widest font-bold mb-3" style={{ color: '#888' }}>
              {stat.label}
            </div>
            <div className="text-5xl font-black" style={{ color: '#4a1942' }}>
              {loading ? '—' : stat.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA for Donors */}
      {user?.role === 'donor' && (
        <motion.div
          className="rounded-2xl p-8 text-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #4a1942 0%, #7a2a6e 60%, #4a1942 100%)' }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {/* decorative circles */}
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-10 bg-white" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full opacity-10 bg-white" />

          <h3 className="text-3xl font-black text-white mb-3 relative z-10">
            Ready to make a difference? 💙
          </h3>
          <p className="text-white/80 mb-6 text-lg relative z-10">
            Start a new donation — every contribution counts.
          </p>
          <motion.button
            onClick={() => navigate('/dashboard/donations/new')}
            className="px-10 py-4 bg-white rounded-xl font-black uppercase tracking-wide inline-flex items-center gap-2 relative z-10"
            style={{ color: '#4a1942' }}
            whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(255,255,255,0.3)' }}
            whileTap={{ scale: 0.95 }}
          >
            <GiftIcon className="w-5 h-5" />
            New Donation
          </motion.button>
        </motion.div>
      )}

      {/* Recent Donations */}
      <div className="card">
        <div className="flex items-center justify-between pb-5 mb-6" style={{ borderBottom: '3px solid #d4a574' }}>
          <h3 className="text-3xl font-black" style={{ color: '#4a1942' }}>
            {user?.role === 'donor'
              ? 'My Recent Donations'
              : user?.role === 'recipient'
                ? 'Available Donations'
                : 'Recent Donations'}
          </h3>
          <motion.button
            onClick={() => navigate('/dashboard/donations')}
            className="font-black text-base transition-colors"
            style={{ color: '#4a1942' }}
            whileHover={{ scale: 1.05 }}
          >
            View All →
          </motion.button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="spinner" />
          </div>
        ) : recentDonations.length > 0 ? (
          <div className="grid gap-4">
            {recentDonations.map((donation, index) => {
              const sc = statusStyle[donation.status] ?? statusStyle.pending;
              return (
                <motion.div
                  key={donation.id}
                  className="p-5 rounded-xl cursor-pointer transition-all relative overflow-hidden"
                  style={{ border: '2px solid #d4a574', background: 'white' }}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  whileHover={{ y: -3, boxShadow: '0 8px 25px rgba(74,25,66,0.12)' }}
                  onClick={() => navigate(`/dashboard/donations/${donation.id}`)}
                >
                  {/* left accent */}
                  <div className="absolute top-0 left-0 w-1 h-full rounded-l-xl"
                    style={{ background: donation.type === 'fund' ? '#2d7d31' : '#e65100' }} />

                  <div className="pl-3 flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {donation.type === 'food'
                        ? <GiftIcon className="w-5 h-5" style={{ color: '#e65100' }} />
                        : <CurrencyDollarIcon className="w-5 h-5" style={{ color: '#2d7d31' }} />}
                      <h4 className="text-base font-black" style={{ color: '#4a1942' }}>
                        {donation.type === 'fund' && donation.amount
                          ? `₹${donation.amount.toLocaleString()}`
                          : donation.quantity}
                      </h4>
                    </div>
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase"
                      style={{ background: sc.bg, color: sc.color, border: `2px solid ${sc.border}` }}>
                      {donation.status}
                    </span>
                  </div>

                  <p className="pl-3 text-sm leading-relaxed truncate" style={{ color: '#666' }}>
                    {donation.description}
                  </p>

                  <div className="pl-3 flex items-center gap-3 mt-2 flex-wrap">
                    <span className="text-xs font-bold uppercase px-2 py-0.5 rounded-full"
                      style={donation.type === 'fund'
                        ? { background: '#e8f5e9', color: '#1b5e20', border: '1px solid #66bb6a' }
                        : { background: '#fff3e0', color: '#e65100', border: '1px solid #ffb74d' }}>
                      {donation.type === 'fund' ? '💵 Fund' : '🍱 Food'}
                    </span>
                    {donation.method && donation.type !== 'fund' && (
                      <span className="text-xs font-bold" style={{ color: '#999' }}>
                        · {donation.method}
                      </span>
                    )}
                    <span className="text-xs ml-auto" style={{ color: '#bbb' }}>
                      {new Date(donation.date).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 px-8 rounded-3xl" style={{ background: '#faf8f5', border: '2px dashed #d4a574' }}>
            <div className="w-48 h-48 mx-auto mb-8 relative">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <circle cx="100" cy="100" r="80" fill="#4a194208" />
                <motion.path
                  d="M60 100 L90 130 L160 60"
                  fill="none"
                  stroke="#d4a574"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.2 }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <GiftIcon className="w-24 h-24 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20" style={{ color: '#4a1942' }} />
              </svg>
            </div>
            <h3 className="text-2xl font-black mb-3" style={{ color: '#4a1942' }}>Your Giving Journey Starts Here</h3>
            <p className="text-base max-w-sm mx-auto mb-8 leading-relaxed" style={{ color: '#888' }}>
              Every big impact begins with a single act of kindness. Start by making your first donation today.
            </p>
            {user?.role === 'donor' && (
              <motion.button
                onClick={() => navigate('/dashboard/donations/new')}
                className="btn-primary inline-flex items-center gap-2 px-8"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">✨</span>
                  <span>Make Your First Donation</span>
                </div>
              </motion.button>
            )}
          </div>
        )}
      </div>

      {/* Impact + Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Impact */}
        <motion.div
          className="card"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <h3 className="text-2xl font-black mb-6" style={{ color: '#4a1942' }}>
            Donation Impact
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-5 rounded-xl"
              style={{ background: '#e8f5e9', border: '2px solid #66bb6a' }}>
              <div>
                <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: '#1b5e20' }}>
                  Food Donations
                </p>
                <p className="text-4xl font-black" style={{ color: '#1b5e20' }}>
                  {donations.filter(d => d.type === 'food').length}
                </p>
              </div>
              <GiftIcon className="h-14 w-14" style={{ color: '#66bb6a' }} />
            </div>
            <div className="flex items-center justify-between p-5 rounded-xl"
              style={{ background: '#e3f2fd', border: '2px solid #42a5f5' }}>
              <div>
                <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: '#0d47a1' }}>
                  Fund Donations
                </p>
                <p className="text-4xl font-black" style={{ color: '#0d47a1' }}>
                  {donations.filter(d => d.type === 'fund').length}
                </p>
              </div>
              <CurrencyDollarIcon className="h-14 w-14" style={{ color: '#42a5f5' }} />
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          className="card"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <h3 className="text-2xl font-black mb-6" style={{ color: '#4a1942' }}>Quick Stats</h3>
          <div className="space-y-1">
            {[
              {
                label: 'Success Rate',
                value: `${stats.totalDonations > 0 ? Math.round((stats.completed / stats.totalDonations) * 100) : 0}%`,
                color: '#2d7d31',
              },
              { label: 'Pending Review', value: `${stats.pending}`, color: '#e65100' },
              { label: 'Actively Approved', value: `${stats.approved}`, color: '#0d47a1' },
              { label: 'Total Helped', value: `${stats.completed} lives`, color: '#4a1942' },
            ].map(row => (
              <div key={row.label} className="flex justify-between items-center p-4 rounded-xl hover:bg-[#faf8f5] transition-colors">
                <span className="font-semibold text-sm" style={{ color: '#555' }}>{row.label}</span>
                <span className="text-2xl font-black" style={{ color: row.color }}>{row.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
