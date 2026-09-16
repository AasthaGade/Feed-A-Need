import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
const UserAddIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (<svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>);
import { useAuth } from '../../hooks/useAuth';
import type { RegisterData } from '../../types';

const Register = () => {
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role') as 'donor' | 'recipient' | null;

  const [formData, setFormData] = useState<RegisterData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
    role: roleParam || 'donor',
    type: 'individual',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (roleParam) {
      setFormData(prev => ({ ...prev, role: roleParam }));
    }
  }, [roleParam]);

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Full name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email address';
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      errors.phone = 'Invalid phone number (10 digits required)';
    }
    if (!formData.address.trim()) errors.address = 'Address is required';
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    if (formData.confirmPassword !== formData.password) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validate()) {
      setError('Please fix the errors below.');
      return;
    }

    setLoading(true);

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-5 py-12" style={{ background: '#faf8f5' }}>
      {/* Decorative background circles */}
      <motion.div
        className="absolute top-[-50%] left-[-20%] w-[500px] h-[500px] rounded-full"
        style={{ background: 'rgba(139, 69, 19, 0.05)' }}
        animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-[-30%] right-[-10%] w-[400px] h-[400px] rounded-full"
        style={{ background: 'rgba(160, 82, 45, 0.05)' }}
        animate={{ scale: [1, 1.2, 1], rotate: [0, -90, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        className="relative z-10 w-full max-w-6xl grid md:grid-cols-2 gap-16 items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Left Side - Hero Content */}
        <motion.div
          className="text-left"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <motion.h1
            className="text-6xl font-black leading-tight mb-8"
            style={{ color: '#4a1942' }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Join Our<br />Community
          </motion.h1>
          <motion.p
            className="text-xl mb-10 leading-relaxed"
            style={{ color: '#333' }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Start making a difference today
          </motion.p>
        </motion.div>

        {/* Right Side - Registration Form */}
        <motion.div
          className="bg-white rounded-3xl shadow-2xl p-12"
          style={{ border: '3px solid #d4a574' }}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="text-center mb-9">
            <motion.div
              className="flex items-center justify-center mb-4"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              <UserAddIcon className="w-20 h-20" style={{ color: '#4a1942' }} />
            </motion.div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#4a1942' }}>
              Create Account
            </h1>
            <p style={{ color: '#666' }} className="text-base">
              Register as a {formData.role === 'donor' ? 'Donor' : 'Recipient'}
            </p>
          </div>

          {error && (
            <motion.div
              className="mb-6 p-4 rounded-xl"
              style={{ background: 'rgba(198, 40, 40, 0.1)', border: '2px solid #c62828' }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-sm font-semibold" style={{ color: '#c62828' }}>{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 font-semibold text-sm" style={{ color: '#4a1942' }}>
                Full Name / Organization
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (formErrors.name) setFormErrors({ ...formErrors, name: '' });
                }}
                placeholder="Enter your name"
                className={`input-field ${formErrors.name ? 'border-red-500' : ''}`}
              />
              {formErrors.name && <p className="text-[10px] font-black uppercase tracking-widest mt-1 text-red-500">{formErrors.name}</p>}
            </div>

            <div>
              <label className="block mb-2 font-semibold text-sm" style={{ color: '#4a1942' }}>
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (formErrors.email) setFormErrors({ ...formErrors, email: '' });
                }}
                placeholder="Enter your email"
                className={`input-field ${formErrors.email ? 'border-red-500' : ''}`}
              />
              {formErrors.email && <p className="text-[10px] font-black uppercase tracking-widest mt-1 text-red-500">{formErrors.email}</p>}
            </div>

            <div>
              <label className="block mb-2 font-semibold text-sm" style={{ color: '#4a1942' }}>
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => {
                  setFormData({ ...formData, phone: e.target.value });
                  if (formErrors.phone) setFormErrors({ ...formErrors, phone: '' });
                }}
                placeholder="Enter your phone number"
                className={`input-field ${formErrors.phone ? 'border-red-500' : ''}`}
              />
              {formErrors.phone && <p className="text-[10px] font-black uppercase tracking-widest mt-1 text-red-500">{formErrors.phone}</p>}
            </div>

            <div>
              <label className="block mb-2 font-semibold text-sm" style={{ color: '#4a1942' }}>
                Address
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => {
                  setFormData({ ...formData, address: e.target.value });
                  if (formErrors.address) setFormErrors({ ...formErrors, address: '' });
                }}
                placeholder="Enter your complete address"
                className={`input-field min-h-[100px] resize-y ${formErrors.address ? 'border-red-500' : ''}`}
              />
              {formErrors.address && <p className="text-[10px] font-black uppercase tracking-widest mt-1 text-red-500">{formErrors.address}</p>}
            </div>

            {formData.role === 'recipient' && (
              <div>
                <label className="block mb-2 font-semibold text-sm" style={{ color: '#4a1942' }}>
                  Account Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'ngo' | 'individual' })}
                  className="input-field"
                >
                  <option value="ngo">NGO / Organization</option>
                  <option value="individual">Individual</option>
                </select>
              </div>
            )}

            <div>
              <label className="block mb-2 font-semibold text-sm" style={{ color: '#4a1942' }}>
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  if (formErrors.password) setFormErrors({ ...formErrors, password: '' });
                }}
                placeholder="Create a password (min 6 characters)"
                className={`input-field ${formErrors.password ? 'border-red-500' : ''}`}
              />
              {formErrors.password && <p className="text-[10px] font-black uppercase tracking-widest mt-1 text-red-500">{formErrors.password}</p>}
            </div>

            <div>
              <label className="block mb-2 font-semibold text-sm" style={{ color: '#4a1942' }}>
                Confirm Password
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => {
                  setFormData({ ...formData, confirmPassword: e.target.value });
                  if (formErrors.confirmPassword) setFormErrors({ ...formErrors, confirmPassword: '' });
                }}
                placeholder="Re-enter password"
                className={`input-field ${formErrors.confirmPassword ? 'border-red-500' : ''}`}
              />
              {formErrors.confirmPassword && <p className="text-[10px] font-black uppercase tracking-widest mt-1 text-red-500">{formErrors.confirmPassword}</p>}
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </motion.button>

            <Link to="/login">
              <motion.button
                type="button"
                className="btn-secondary w-full mt-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Back to Login
              </motion.button>
            </Link>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;
