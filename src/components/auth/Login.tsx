import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';

// ─── Inline SVG Icons ─────────────────────────────────────────────────────────
const CheckCircleIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (<svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
const LocationMarkerIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (<svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>);
const CreditCardIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (<svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>);
const ChartBarIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (<svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>);
const BellIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (<svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>);
const CopyIcon = ({ className }: { className?: string }) => (<svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>);
const CheckIcon = ({ className }: { className?: string }) => (<svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>);
const ShieldIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (<svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>);
const ChevronDownIcon = ({ className }: { className?: string }) => (<svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>);
const ChevronUpIcon = ({ className }: { className?: string }) => (<svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>);
const ArrowRightIcon = ({ className }: { className?: string }) => (<svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>);
const AdminIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (<svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>);
const DonorIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (<svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>);
const RecipientIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (<svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>);
const UserPlusIcon = ({ className }: { className?: string }) => (<svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>);

// ─── Demo accounts ─────────────────────────────────────────────────────────────
const DEMO_ACCOUNTS = [
  {
    role: 'Admin',
    label: 'Administrator',
    desc: 'Full platform access',
    Icon: AdminIcon,
    email: 'admin@example.com',
    password: 'admin123',
    color: '#c084fc',
    darkColor: '#7e22ce',
  },
  {
    role: 'Donor',
    label: 'Donor',
    desc: 'Create & manage donations',
    Icon: DonorIcon,
    email: 'donor@example.com',
    password: 'donor123',
    color: '#4ade80',
    darkColor: '#15803d',
  },
  {
    role: 'Recipient',
    label: 'Recipient',
    desc: 'View & receive donations',
    Icon: RecipientIcon,
    email: 'recipient@example.com',
    password: 'recipient123',
    color: '#60a5fa',
    darkColor: '#1d4ed8',
  },
];

// ─── Component ─────────────────────────────────────────────────────────────────
const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [validationErrors, setValidationErrors] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [showDemo, setShowDemo] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = { username: '', password: '' };
    let isValid = true;

    if (!formData.username.trim()) {
      errors.username = 'Username or Email is required';
      isValid = false;
    }
    if (!formData.password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const doLogin = async (username: string, password: string) => {
    setError('');
    setLoading(true);
    try {
      await login({ username, password });
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      doLogin(formData.username, formData.password);
    }
  };

  const handleDemoLogin = (acc: typeof DEMO_ACCOUNTS[0]) => {
    setFormData({ username: acc.email, password: acc.password });
    setShowDemo(false);
    doLogin(acc.email, acc.password);
  };

  const handleCopy = (key: string, value: string) => {
    navigator.clipboard.writeText(value).catch(() => {
      const el = document.createElement('textarea');
      el.value = value;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    });
    setCopied(key);
    setTimeout(() => setCopied(null), 1800);
  };

  const features = [
    { icon: CheckCircleIcon, text: 'Real-time Donation Tracking' },
    { icon: LocationMarkerIcon, text: 'Location-based Matching' },
    { icon: CreditCardIcon, text: 'Secure Payment Integration' },
    { icon: ChartBarIcon, text: 'Analytics Dashboard' },
    { icon: BellIcon, text: 'Instant Notifications' },
  ];

  return (
    <div className="min-h-screen w-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #fdf9f6 0%, #f5ede8 40%, #f0e8f5 100%)' }}>

      <motion.div
        className="w-full max-w-6xl mx-auto px-6 py-10 grid lg:grid-cols-2 gap-10 items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >

        {/* ── LEFT: Branding ─────────────────────────── */}
        <motion.div
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.55 }}
        >
          {/* Logo */}
          <motion.div
            className="flex items-center gap-4 mb-10"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <img
              src="/FeedaNeedLogo.png"
              alt="Feed a Need"
              className="w-16 h-16 object-cover rounded-2xl"
              style={{ boxShadow: '0 0 0 3px rgba(212,165,116,0.5), 0 8px 20px rgba(74,25,66,0.15)' }}
            />
            <div>
              <h1 className="text-3xl font-black tracking-tight leading-none" style={{ color: '#4a1942' }}>
                Feed<span style={{ color: '#d4a574' }}> a </span>Need
              </h1>
              <p className="text-xs font-bold uppercase tracking-[0.2em] mt-1" style={{ color: '#c9956a' }}>
                Food &amp; Fund Donation Platform
              </p>
            </div>
          </motion.div>

          {/* Tagline */}
          <motion.div
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            <h2 className="text-5xl font-black leading-tight mb-4" style={{ color: '#4a1942' }}>
              Connecting<br />
              <span style={{ color: '#d4a574' }}>Generosity</span><br />
              to Need
            </h2>
            <p className="text-base leading-relaxed mb-8" style={{ color: '#666' }}>
              A transparent, secure platform where food donors meet local organisations and individuals — in real time.
            </p>
          </motion.div>

          {/* Feature list */}
          <motion.div
            className="rounded-2xl p-6"
            style={{ background: 'white', border: '3px solid #d4a574', boxShadow: '0 4px 16px rgba(74,25,66,0.08)' }}
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.45 }}
          >
            <p className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: '#4a1942' }}>
              Platform Features
            </p>
            <ul className="space-y-3">
              {features.map((f, i) => (
                <motion.li
                  key={i}
                  className="flex items-center gap-3 text-sm font-semibold"
                  style={{ color: '#333' }}
                  initial={{ x: -12, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.07 }}
                >
                  <f.icon className="w-4 h-4 flex-shrink-0" style={{ color: '#d4a574' }} />
                  {f.text}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* ── RIGHT: Login Form ─────────────────────── */}
        <motion.div
          className="rounded-2xl p-8 bg-white"
          style={{ border: '3px solid #d4a574', boxShadow: '0 8px 40px rgba(74,25,66,0.12)' }}
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.55 }}
        >
          {/* Header */}
          <div className="text-center mb-7">
            <h3 className="text-2xl font-black mb-1" style={{ color: '#4a1942' }}>Welcome Back</h3>
            <p className="text-sm" style={{ color: '#888' }}>Sign in to your account</p>
          </div>

          {/* Quick Demo Sign-In */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <ShieldIcon className="w-4 h-4 flex-shrink-0" style={{ color: '#4a1942' }} />
              <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#4a1942' }}>Quick Demo Sign In</span>
              <div className="flex-1 h-0.5 rounded" style={{ background: '#d4a574', opacity: 0.5 }} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {DEMO_ACCOUNTS.map((acc) => (
                <motion.button
                  key={acc.role}
                  onClick={() => handleDemoLogin(acc)}
                  className="flex flex-col items-center justify-center gap-2.5 py-4 px-3 rounded-2xl transition-all"
                  style={{
                    background: `${acc.color}10`,
                    border: `2px solid ${acc.color}45`,
                  }}
                  whileHover={{
                    background: `${acc.color}20`,
                    borderColor: acc.color,
                    scale: 1.04,
                    boxShadow: `0 6px 20px ${acc.color}35`,
                  }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ duration: 0.16 }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${acc.color}18`, border: `2px solid ${acc.color}55` }}
                  >
                    <acc.Icon className="w-5 h-5" style={{ color: acc.color } as React.CSSProperties} />
                  </div>
                  <span className="text-xs font-black uppercase tracking-wide" style={{ color: acc.color }}>
                    {acc.role}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Demo Credentials Accordion */}
          <div className="mb-5">
            <button
              onClick={() => setShowDemo(p => !p)}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all"
              style={{
                background: showDemo ? '#f0ebe5' : '#faf8f5',
                color: showDemo ? '#4a1942' : '#999',
                border: `2px solid ${showDemo ? '#d4a574' : '#e8e0d8'}`,
              }}
            >
              <span>View Demo Credentials</span>
              {showDemo ? <ChevronUpIcon className="w-3.5 h-3.5" /> : <ChevronDownIcon className="w-3.5 h-3.5" />}
            </button>

            <AnimatePresence>
              {showDemo && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.22 }}
                  className="overflow-hidden"
                >
                  <div className="pt-2 space-y-2">
                    {DEMO_ACCOUNTS.map((acc) => (
                      <div
                        key={acc.role}
                        className="rounded-xl overflow-hidden"
                        style={{ border: `2px solid ${acc.color}30`, background: `${acc.color}08` }}
                      >
                        <div
                          className="flex items-center justify-between px-3 py-2"
                          style={{ background: `${acc.color}15`, borderBottom: `1px solid ${acc.color}20` }}
                        >
                          <div className="flex items-center gap-2">
                            <acc.Icon className="w-4 h-4" style={{ color: acc.color } as React.CSSProperties} />
                            <div>
                              <p className="text-xs font-black leading-none" style={{ color: acc.color }}>{acc.label}</p>
                              <p className="text-xs mt-0.5" style={{ color: '#888' }}>{acc.desc}</p>
                            </div>
                          </div>
                          <motion.button
                            onClick={() => handleDemoLogin(acc)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black uppercase"
                            style={{ background: `${acc.color}18`, color: acc.color, border: `1px solid ${acc.color}40` }}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Sign In <ArrowRightIcon className="w-3 h-3" />
                          </motion.button>
                        </div>
                        <div className="px-3 py-2.5 space-y-1.5">
                          {[{ key: 'email', label: 'Email', value: acc.email }, { key: 'pass', label: 'Password', value: acc.password }].map(({ key, label, value }) => (
                            <div key={key} className="flex items-center justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: '#aaa' }}>{label}</p>
                                <p className="text-xs font-bold truncate" style={{ color: '#333', fontFamily: 'monospace' }}>{value}</p>
                              </div>
                              <motion.button
                                onClick={() => handleCopy(`${acc.role}-${key}`, value)}
                                className="shrink-0 p-1.5 rounded-lg"
                                style={{
                                  background: copied === `${acc.role}-${key}` ? acc.color : '#faf8f5',
                                  color: copied === `${acc.role}-${key}` ? '#fff' : acc.color,
                                  border: `1px solid ${acc.color}40`,
                                }}
                                whileTap={{ scale: 0.88 }}
                              >
                                {copied === `${acc.role}-${key}` ? <CheckIcon className="w-3 h-3" /> : <CopyIcon className="w-3 h-3" />}
                              </motion.button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    <p className="text-center text-xs" style={{ color: '#bbb' }}>
                      For demonstration purposes only
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px" style={{ background: '#e8e0d8' }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#bbb' }}>or sign in manually</span>
            <div className="flex-1 h-px" style={{ background: '#e8e0d8' }} />
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                className="mb-4 p-3 rounded-xl flex items-start gap-2"
                style={{ background: '#fff5f5', border: '2px solid #fca5a5' }}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
              >
                <ShieldIcon className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#c62828' }} />
                <p className="text-sm font-semibold" style={{ color: '#c62828' }}>{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1.5 text-xs font-black uppercase tracking-widest" style={{ color: '#4a1942' }}>
                Username / Email
              </label>
              <input
                id="login-username"
                type="text"
                value={formData.username}
                onChange={e => {
                  setFormData({ ...formData, username: e.target.value });
                  if (validationErrors.username) setValidationErrors({ ...validationErrors, username: '' });
                }}
                placeholder="Enter your username or email"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: `2px solid ${validationErrors.username ? '#ef4444' : '#d4a574'}`,
                  background: '#faf8f5',
                  color: '#333',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                onFocus={e => {
                  if (!validationErrors.username) {
                    e.target.style.borderColor = '#4a1942';
                    e.target.style.boxShadow = '0 0 0 3px rgba(74,25,66,0.1)';
                  }
                }}
                onBlur={e => {
                  if (!validationErrors.username) {
                    e.target.style.borderColor = '#d4a574';
                    e.target.style.boxShadow = 'none';
                  }
                }}
              />
              <AnimatePresence>
                {validationErrors.username && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-[10px] font-black uppercase tracking-widest mt-1 text-red-500"
                  >
                    {validationErrors.username}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            <div>
              <label className="block mb-1.5 text-xs font-black uppercase tracking-widest" style={{ color: '#4a1942' }}>
                Password
              </label>
              <input
                id="login-password"
                type="password"
                value={formData.password}
                onChange={e => {
                  setFormData({ ...formData, password: e.target.value });
                  if (validationErrors.password) setValidationErrors({ ...validationErrors, password: '' });
                }}
                placeholder="Enter your password"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: `2px solid ${validationErrors.password ? '#ef4444' : '#d4a574'}`,
                  background: '#faf8f5',
                  color: '#333',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                onFocus={e => {
                  if (!validationErrors.password) {
                    e.target.style.borderColor = '#4a1942';
                    e.target.style.boxShadow = '0 0 0 3px rgba(74,25,66,0.1)';
                  }
                }}
                onBlur={e => {
                  if (!validationErrors.password) {
                    e.target.style.borderColor = '#d4a574';
                    e.target.style.boxShadow = 'none';
                  }
                }}
              />
              <AnimatePresence>
                {validationErrors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-[10px] font-black uppercase tracking-widest mt-1 text-red-500"
                  >
                    {validationErrors.password}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-black text-sm uppercase tracking-widest"
              style={{
                background: loading ? '#e0c9b0' : '#4a1942',
                color: 'white',
                boxShadow: loading ? 'none' : '0 4px 20px rgba(74,25,66,0.3)',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
              whileHover={{ scale: loading ? 1 : 1.02, boxShadow: loading ? 'none' : '0 6px 28px rgba(74,25,66,0.4)' }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing In…
                </>
              ) : (
                <>Sign In <ArrowRightIcon className="w-4 h-4" /></>
              )}
            </motion.button>
          </form>

          {/* Register links */}
          <div className="mt-6 pt-5 text-center" style={{ borderTop: '2px solid #ede8e2' }}>
            <p className="mb-3 text-xs font-bold uppercase tracking-widest" style={{ color: '#999' }}>
              New to Feed a Need?
            </p>
            <div className="flex gap-3 justify-center">
              <Link to="/register?role=donor">
                <motion.button
                  type="button"
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wide"
                  style={{ border: '2px solid #d4a574', background: '#faf8f5', color: '#4a1942' }}
                  whileHover={{ background: '#4a1942', color: 'white', borderColor: '#4a1942', scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                >
                  <UserPlusIcon className="w-3.5 h-3.5" />
                  Register as Donor
                </motion.button>
              </Link>
              <Link to="/register?role=recipient">
                <motion.button
                  type="button"
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wide"
                  style={{ border: '2px solid #c9956a', background: '#faf8f5', color: '#c9956a' }}
                  whileHover={{ background: '#c9956a', color: 'white', scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                >
                  <RecipientIcon className="w-3.5 h-3.5" />
                  Register as Recipient
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
