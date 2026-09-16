import { motion } from 'framer-motion';
import { useDonations } from '../../hooks/useDonations';
const ChartBarIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (<svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>);
const TrendingUpIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (<svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>);
const GiftIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (<svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13H8.5a3.5 3.5 0 010-7C10 1 12 5 12 5zm0 0h3.5a3.5 3.5 0 000-7C14 1 12 5 12 5zm-7 4h14M5 12v9h14v-9" /></svg>);
const CurrencyDollarIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (<svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
const CheckCircleIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (<svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
const ClockIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (<svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);

const Analytics = () => {
  const { donations } = useDonations();

  const stats = {
    total: donations.length,
    foodDonations: donations.filter((d) => d.type === 'food').length,
    fundDonations: donations.filter((d) => d.type === 'fund').length,
    completed: donations.filter((d) => d.status === 'completed').length,
    approved: donations.filter((d) => d.status === 'approved').length,
    pending: donations.filter((d) => d.status === 'pending').length,
    completedRate:
      donations.length > 0
        ? Math.round(
          (donations.filter((d) => d.status === 'completed').length /
            donations.length) *
          100
        )
        : 0,
  };

  const monthlyData = donations.reduce((acc, donation) => {
    const month = new Date(donation.timestamp).toLocaleDateString('default', {
      month: 'short',
    });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statCards = [
    { title: 'Total Donations', value: stats.total, icon: ChartBarIcon, color: '#4a1942' },
    { title: 'Food Donations', value: stats.foodDonations, icon: GiftIcon, color: '#2d7d31' },
    { title: 'Fund Donations', value: stats.fundDonations, icon: CurrencyDollarIcon, color: '#0d47a1' },
    { title: 'Success Rate', value: `${stats.completedRate}% `, icon: TrendingUpIcon, color: '#d4a574' },
  ];

  const statusCards = [
    { status: 'Completed', count: stats.completed, icon: CheckCircleIcon, bgColor: '#e8f5e9', borderColor: '#66bb6a', textColor: '#1b5e20' },
    { status: 'Approved', count: stats.approved, icon: CheckCircleIcon, bgColor: '#e3f2fd', borderColor: '#42a5f5', textColor: '#0d47a1' },
    { status: 'Pending', count: stats.pending, icon: ClockIcon, bgColor: '#fff3e0', borderColor: '#ffa726', textColor: '#e65100' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-4xl font-black" style={{ color: '#4a1942' }}>Analytics</h1>
        <p className="text-lg mt-1" style={{ color: '#666' }}>
          Insights and statistics about donation activities
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <motion.div
            key={idx}
            className="stat-card"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: idx * 0.05 }}
          >
            <stat.icon className="w-12 h-12 mb-3 mx-auto" style={{ color: stat.color }} />
            <div className="text-sm uppercase tracking-wider font-bold mb-3" style={{ color: '#666' }}>
              {stat.title}
            </div>
            <div className="text-5xl font-black" style={{ color: '#4a1942' }}>
              {stat.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Donations Chart */}
        <motion.div
          className="card"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-black mb-6" style={{ color: '#4a1942' }}>
            Monthly Donations
          </h2>
          <div className="space-y-4">
            {Object.entries(monthlyData).length > 0 ? (
              Object.entries(monthlyData).map(([month, count]) => (
                <div key={month} className="flex items-center gap-4">
                  <span className="w-16 text-sm font-bold" style={{ color: '#4a1942' }}>{month}</span>
                  <div className="flex-1">
                    <div className="w-full h-3 rounded-full" style={{ background: '#faf8f5' }}>
                      <motion.div
                        className="h-3 rounded-full"
                        style={{ background: '#4a1942' }}
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(count / Math.max(...Object.values(monthlyData))) * 100}% `,
                        }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                      />
                    </div>
                  </div>
                  <span className="text-lg font-black w-10 text-right" style={{ color: '#4a1942' }}>
                    {count}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center py-8" style={{ color: '#999' }}>No data available</p>
            )}
          </div>
        </motion.div>

        {/* Donation Status */}
        <motion.div
          className="card"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-black mb-6" style={{ color: '#4a1942' }}>
            Donation Status
          </h2>
          <div className="space-y-4">
            {statusCards.map(({ status, count, icon: Icon, bgColor, borderColor, textColor }) => (
              <motion.div
                key={status}
                className="p-5 rounded-xl flex items-center justify-between"
                style={{ background: bgColor, border: `2px solid ${borderColor} ` }}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-8 h-8" style={{ color: textColor }} />
                  <span className="font-bold text-lg" style={{ color: textColor }}>{status}</span>
                </div>
                <span className="text-3xl font-black" style={{ color: textColor }}>
                  {count}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Key Metrics */}
      <motion.div
        className="card"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-2xl font-black mb-6" style={{ color: '#4a1942' }}>
          Key Metrics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 rounded-xl" style={{ background: '#f0ebe5', border: '2px solid #d4a574' }}>
            <p className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: '#666' }}>
              Average per Month
            </p>
            <p className="text-4xl font-black" style={{ color: '#4a1942' }}>
              {Object.keys(monthlyData).length > 0
                ? Math.round(stats.total / Object.keys(monthlyData).length)
                : 0}
            </p>
          </div>
          <div className="text-center p-6 rounded-xl" style={{ background: '#e8f5e9', border: '2px solid #66bb6a' }}>
            <p className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: '#1b5e20' }}>
              Most Active Month
            </p>
            <p className="text-4xl font-black" style={{ color: '#1b5e20' }}>
              {Object.keys(monthlyData).length > 0
                ? Object.entries(monthlyData).sort((a, b) => b[1] - a[1])[0][0]
                : 'N/A'}
            </p>
          </div>
          <div className="text-center p-6 rounded-xl" style={{ background: '#e3f2fd', border: '2px solid #42a5f5' }}>
            <p className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: '#0d47a1' }}>
              Total Impact
            </p>
            <p className="text-4xl font-black" style={{ color: '#0d47a1' }}>
              {stats.completed} Lives
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Analytics;
