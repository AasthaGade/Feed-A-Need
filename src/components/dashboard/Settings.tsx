import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
// CogIcon available if needed later
const UserIcon = ({ className }: { className?: string }) => (<svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>);
const BellIcon = ({ className }: { className?: string }) => (<svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>);
const ShieldCheckIcon = ({ className }: { className?: string }) => (<svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>);
const SaveIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (<svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>);

const Settings = () => {
    const { user, updateUser } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [saved, setSaved] = useState(false);

    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
    });

    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: true,
        pushNotifications: true,
        donationUpdates: true,
        weeklyReport: false,
    });

    const handleSaveProfile = () => {
        if (user) {
            updateUser({ ...user, ...profileData });
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        }
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: UserIcon },
        { id: 'notifications', label: 'Notifications', icon: BellIcon },
        { id: 'security', label: 'Security', icon: ShieldCheckIcon },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
        >
            <div>
                <h1 className="text-4xl font-black mb-3" style={{ color: '#4a1942' }}>
                    Settings
                </h1>
                <p className="text-lg" style={{ color: '#666' }}>
                    Manage your account preferences and settings
                </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-3 flex-wrap">
                {tabs.map((tab) => (
                    <motion.button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className="px-6 py-3 rounded-xl font-bold uppercase tracking-wide text-sm transition-all duration-200 flex items-center gap-2"
                        style={{
                            background: activeTab === tab.id ? '#4a1942' : 'white',
                            color: activeTab === tab.id ? 'white' : '#4a1942',
                            border: `3px solid ${activeTab === tab.id ? '#4a1942' : '#d4a574'}`,
                        }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <tab.icon className="w-5 h-5" />
                        {tab.label}
                    </motion.button>
                ))}
            </div>

            {/* Success Message */}
            {saved && (
                <motion.div
                    className="p-4 rounded-xl flex items-center gap-3"
                    style={{ background: '#e8f5e9', border: '2px solid #66bb6a' }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <SaveIcon className="w-6 h-6" style={{ color: '#1b5e20' }} />
                    <p className="font-bold" style={{ color: '#1b5e20' }}>
                        Settings saved successfully!
                    </p>
                </motion.div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
                <motion.div
                    className="card"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <h2 className="text-2xl font-black mb-6" style={{ color: '#4a1942' }}>
                        Profile Information
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <label className="block mb-2 font-bold text-sm uppercase tracking-wide" style={{ color: '#4a1942' }}>
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={profileData.name}
                                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                className="input-field"
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-bold text-sm uppercase tracking-wide" style={{ color: '#4a1942' }}>
                                Email
                            </label>
                            <input
                                type="email"
                                value={profileData.email}
                                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                className="input-field"
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-bold text-sm uppercase tracking-wide" style={{ color: '#4a1942' }}>
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                value={profileData.phone}
                                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                className="input-field"
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-bold text-sm uppercase tracking-wide" style={{ color: '#4a1942' }}>
                                Address
                            </label>
                            <textarea
                                value={profileData.address}
                                onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                                rows={3}
                                className="input-field resize-y"
                            />
                        </div>

                        <div className="pt-4">
                            <motion.button
                                onClick={handleSaveProfile}
                                className="btn-primary inline-flex items-center gap-2"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <SaveIcon className="w-5 h-5" />
                                Save Changes
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
                <motion.div
                    className="card"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <h2 className="text-2xl font-black mb-6" style={{ color: '#4a1942' }}>
                        Notification Preferences
                    </h2>

                    <div className="space-y-4">
                        {[
                            { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive updates via email' },
                            { key: 'pushNotifications', label: 'Push Notifications', desc: 'Receive browser notifications' },
                            { key: 'donationUpdates', label: 'Donation Updates', desc: 'Get notified about donation status changes' },
                            { key: 'weeklyReport', label: 'Weekly Report', desc: 'Receive weekly summary of your activities' },
                        ].map((setting) => (
                            <div
                                key={setting.key}
                                className="flex items-center justify-between p-5 rounded-xl"
                                style={{ background: '#faf8f5', border: '2px solid #d4a574' }}
                            >
                                <div className="flex-1">
                                    <p className="font-bold text-base mb-1" style={{ color: '#4a1942' }}>
                                        {setting.label}
                                    </p>
                                    <p className="text-sm" style={{ color: '#666' }}>
                                        {setting.desc}
                                    </p>
                                </div>
                                <button
                                    onClick={() =>
                                        setNotificationSettings({
                                            ...notificationSettings,
                                            [setting.key]: !notificationSettings[setting.key as keyof typeof notificationSettings],
                                        })
                                    }
                                    className="relative w-14 h-8 rounded-full transition-all duration-200"
                                    style={{
                                        background: notificationSettings[setting.key as keyof typeof notificationSettings]
                                            ? '#4a1942'
                                            : '#ccc',
                                    }}
                                >
                                    <motion.div
                                        className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                                        animate={{
                                            left: notificationSettings[setting.key as keyof typeof notificationSettings] ? '30px' : '4px',
                                        }}
                                        transition={{ duration: 0.2 }}
                                    />
                                </button>
                            </div>
                        ))}

                        <div className="pt-4">
                            <motion.button
                                onClick={() => {
                                    setSaved(true);
                                    setTimeout(() => setSaved(false), 3000);
                                }}
                                className="btn-primary inline-flex items-center gap-2"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <SaveIcon className="w-5 h-5" />
                                Save Preferences
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
                <motion.div
                    className="card"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <h2 className="text-2xl font-black mb-6" style={{ color: '#4a1942' }}>
                        Security Settings
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <label className="block mb-2 font-bold text-sm uppercase tracking-wide" style={{ color: '#4a1942' }}>
                                Current Password
                            </label>
                            <input
                                type="password"
                                placeholder="Enter current password"
                                className="input-field"
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-bold text-sm uppercase tracking-wide" style={{ color: '#4a1942' }}>
                                New Password
                            </label>
                            <input
                                type="password"
                                placeholder="Enter new password"
                                className="input-field"
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-bold text-sm uppercase tracking-wide" style={{ color: '#4a1942' }}>
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                placeholder="Confirm new password"
                                className="input-field"
                            />
                        </div>

                        <div className="pt-4">
                            <motion.button
                                onClick={() => {
                                    setSaved(true);
                                    setTimeout(() => setSaved(false), 3000);
                                }}
                                className="btn-primary inline-flex items-center gap-2"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <ShieldCheckIcon className="w-5 h-5" />
                                Update Password
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default Settings;
