import { motion } from 'framer-motion';
import { useState } from 'react';
import { useDonations } from '../../hooks/useDonations';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// ─── Inline SVG icons ────────────────────────────────────────────────────────
const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);
const FilterIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
  </svg>
);
const GiftIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13H8.5a3.5 3.5 0 010-7C10 1 12 5 12 5zm0 0h3.5a3.5 3.5 0 000-7C14 1 12 5 12 5zm-7 4h14M5 12v9h14v-9" />
  </svg>
);
const CashIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

// ─── Badge colour map for method (including 'online') ────────────────────────
const methodBadgeStyle: Record<string, React.CSSProperties> = {
  pickup: { background: '#e3f2fd', color: '#0d47a1', border: '2px solid #42a5f5' },
  dropoff: { background: '#f3e5f5', color: '#4a148c', border: '2px solid #ab47bc' },
  delivery: { background: '#e8f5e9', color: '#1b5e20', border: '2px solid #66bb6a' },
  online: { background: '#fff3e0', color: '#e65100', border: '2px solid #ffb74d' },
};

const Donations = () => {
  const { donations, loading, approveDonation, completeDonation, deleteDonation } = useDonations();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'completed'>('all');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'food' | 'fund'>('all');

  const filteredDonations = donations.filter((d) => {
    const matchesStatus = filter === 'all' || d.status === filter;
    const matchesType = typeFilter === 'all' || d.type === typeFilter;
    const matchesSearch =
      search === '' ||
      d.description.toLowerCase().includes(search.toLowerCase()) ||
      d.donor.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });

  const handleApprove = async (id: string) => {
    try { await approveDonation(id); } catch (e) { console.error(e); }
  };
  const handleComplete = async (id: string) => {
    try { await completeDonation(id); } catch (e) { console.error(e); }
  };
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this donation?')) {
      try { await deleteDonation(id); } catch (e) { console.error(e); }
    }
  };

  const filterOptions = [
    { value: 'all', label: 'All', count: donations.length },
    { value: 'pending', label: 'Pending', count: donations.filter(d => d.status === 'pending').length },
    { value: 'approved', label: 'Approved', count: donations.filter(d => d.status === 'approved').length },
    { value: 'completed', label: 'Completed', count: donations.filter(d => d.status === 'completed').length },
  ];

  const statusColor: Record<string, { bg: string; color: string; border: string }> = {
    pending: { bg: '#fff3e0', color: '#e65100', border: '#ffb74d' },
    approved: { bg: '#e8f5e9', color: '#1b5e20', border: '#66bb6a' },
    completed: { bg: '#f5f5f5', color: '#424242', border: '#9e9e9e' },
    cancelled: { bg: '#ffebee', color: '#b71c1c', border: '#ef9a9a' },
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black" style={{ color: '#4a1942' }}>Donations</h1>
          <p className="text-base mt-1" style={{ color: '#777' }}>
            {donations.length} donation{donations.length !== 1 ? 's' : ''} total
          </p>
        </div>
        {user?.role === 'donor' && (
          <motion.button
            onClick={() => navigate('/dashboard/donations/new')}
            className="btn-primary inline-flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <PlusIcon className="h-5 w-5" />
            New Donation
          </motion.button>
        )}
      </div>

      {/* Search + Filters Panel */}
      <div className="card !mb-0">
        {/* Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-5">
          <div className="flex-1 relative">
            <svg className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by donor or description…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <FilterIcon className="h-4 w-4 shrink-0" style={{ color: '#4a1942' }} />
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value as any)}
              className="input-field"
            >
              <option value="all">All Types</option>
              <option value="food">🍱 Food</option>
              <option value="fund">💵 Fund</option>
            </select>
          </div>
        </div>

        {/* Status Chips */}
        <div className="flex flex-wrap gap-3">
          {filterOptions.map(opt => (
            <motion.button
              key={opt.value}
              onClick={() => setFilter(opt.value as any)}
              className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wide transition-all"
              style={{
                background: filter === opt.value ? '#4a1942' : 'white',
                color: filter === opt.value ? 'white' : '#555',
                border: `2px solid ${filter === opt.value ? '#4a1942' : '#d4a574'}`,
              }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {opt.label}
              <span className="ml-2 px-2 py-0.5 rounded-full text-xs"
                style={{ background: filter === opt.value ? 'rgba(255,255,255,0.2)' : '#faf8f5' }}>
                {opt.count}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Donations Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="spinner" />
        </div>
      ) : filteredDonations.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredDonations.map((donation, index) => {
            const sc = statusColor[donation.status] || statusColor.pending;
            const isFund = donation.type === 'fund';
            return (
              <motion.div
                key={donation.id}
                className="card cursor-pointer !mb-0 relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                whileHover={{ y: -6, boxShadow: '0 12px 32px rgba(74,25,66,0.18)' }}
                onClick={() => navigate(`/dashboard/donations/${donation.id}`)}
              >
                {/* Accent stripe */}
                <div className="absolute top-0 left-0 w-1.5 h-full rounded-l-xl"
                  style={{ background: isFund ? '#2d7d31' : '#e65100' }} />

                <div className="pl-4">
                  {/* Header row */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {isFund
                        ? <CashIcon className="w-6 h-6" style={{ color: '#2d7d31' }} />
                        : <GiftIcon className="w-6 h-6" style={{ color: '#e65100' }} />}
                      <h3 className="text-lg font-black" style={{ color: '#4a1942' }}>
                        {isFund && donation.amount
                          ? `₹${donation.amount.toLocaleString()}`
                          : donation.quantity}
                      </h3>
                    </div>
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase"
                      style={{ background: sc.bg, color: sc.color, border: `2px solid ${sc.border}` }}>
                      {donation.status}
                    </span>
                  </div>

                  <p className="text-sm leading-relaxed mb-3" style={{ color: '#555' }}>
                    {donation.description}
                  </p>

                  {/* Badges row */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase"
                      style={isFund
                        ? { background: '#e8f5e9', color: '#1b5e20', border: '2px solid #66bb6a' }
                        : { background: '#fff3e0', color: '#e65100', border: '2px solid #ffb74d' }}>
                      {isFund ? '💵 Fund' : '🍱 Food'}
                    </span>
                    {donation.method && !isFund && (
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase"
                        style={methodBadgeStyle[donation.method] || methodBadgeStyle.delivery}>
                        {donation.method}
                      </span>
                    )}
                    {donation.paymentStatus === 'paid' && (
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase"
                        style={{ background: '#e8f5e9', color: '#1b5e20', border: '2px solid #66bb6a' }}>
                        ✓ Paid
                      </span>
                    )}
                  </div>

                  {/* Donor info */}
                  <div className="pt-3" style={{ borderTop: '2px solid #faf8f5' }}>
                    <p className="text-xs font-bold mb-0.5" style={{ color: '#4a1942' }}>
                      {donation.donor}
                    </p>
                    <p className="text-xs truncate" style={{ color: '#888' }}>
                      📍 {donation.location}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: '#bbb' }}>
                      {new Date(donation.date).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                    </p>
                  </div>

                  {/* Admin actions */}
                  {user?.role === 'admin' && (
                    <div className="flex gap-2 mt-4 pt-4" style={{ borderTop: '2px solid #d4a574' }}
                      onClick={e => e.stopPropagation()}>
                      {donation.status === 'pending' && (
                        <motion.button
                          onClick={() => handleApprove(donation.id)}
                          className="btn-success flex-1 text-xs py-2"
                          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        >
                          ✓ Approve
                        </motion.button>
                      )}
                      {donation.status === 'approved' && (
                        <motion.button
                          onClick={() => handleComplete(donation.id)}
                          className="btn-primary flex-1 text-xs py-2"
                          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        >
                          ✓ Complete
                        </motion.button>
                      )}
                      <motion.button
                        onClick={() => handleDelete(donation.id)}
                        className="btn-danger text-xs py-2 px-4"
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      >
                        Delete
                      </motion.button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="card text-center py-20 px-8" style={{ background: '#faf8f5', border: '2px dashed #d4a574' }}>
          <div className="w-48 h-48 mx-auto mb-8 relative">
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full opacity-10" style={{ color: '#4a1942' }}>
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <GiftIcon className="w-16 h-16 opacity-30" style={{ color: '#4a1942' }} />
            </div>
          </div>
          <h3 className="text-2xl font-black mb-3" style={{ color: '#4a1942' }}>Nothing to Show Here</h3>
          <p className="text-base max-w-sm mx-auto mb-8 leading-relaxed" style={{ color: '#888' }}>
            {search || filter !== 'all' || typeFilter !== 'all'
              ? "We couldn't find any donations matching your specific filters. Try broadening your search!"
              : "Your donation list is currently empty. Be the change someone is waiting for today."}
          </p>
          {!search && filter === 'all' && typeFilter === 'all' && user?.role === 'donor' && (
            <motion.button
              onClick={() => navigate('/dashboard/donations/new')}
              className="btn-primary inline-flex items-center gap-2 px-8"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            >
              <PlusIcon className="h-5 w-5" />
              <span>Make a Donation</span>
            </motion.button>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default Donations;
