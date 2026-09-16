import { motion } from 'framer-motion';
const BellIcon = ({ className }: { className?: string }) => (<svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>);
const ClockIcon = ({ className }: { className?: string }) => (<svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
const CheckCircleIcon = ({ className }: { className?: string }) => (<svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
const ExclamationIcon = ({ className }: { className?: string }) => (<svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>);
import { useState } from 'react';

const Notifications = () => {
    const [notifications] = useState([
        {
            id: 1,
            type: 'success',
            title: 'Donation Approved',
            message: 'Your food donation of "50kg Rice" has been approved.',
            time: '2 hours ago',
        },
        {
            id: 2,
            type: 'info',
            title: 'New Request',
            message: 'A nearby shelter has requested 20 meals.',
            time: '5 hours ago',
        },
        {
            id: 3,
            type: 'warning',
            title: 'Profile Updated',
            message: 'You successfully updated your profile settings.',
            time: 'Yesterday',
        },
    ]);

    const getIcon = (type: string) => {
        switch (type) {
            case 'success':
                return <CheckCircleIcon className="w-6 h-6 text-green-600" />;
            case 'warning':
                return <ExclamationIcon className="w-6 h-6 text-yellow-600" />;
            default:
                return <ClockIcon className="w-6 h-6 text-blue-600" />;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
        >
            <div>
                <h1 className="text-4xl font-black mb-3" style={{ color: '#4a1942' }}>
                    Notifications
                </h1>
                <p className="text-lg" style={{ color: '#666' }}>
                    Recent updates and alerts
                </p>
            </div>

            <div className="card">
                {notifications.length > 0 ? (
                    <div className="space-y-4">
                        {notifications.map((notification, index) => (
                            <motion.div
                                key={notification.id}
                                className="flex items-start gap-4 p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors rounded-lg"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="mt-1 bg-gray-100 p-2 rounded-full">
                                    {getIcon(notification.type)}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg" style={{ color: '#4a1942' }}>
                                        {notification.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-1">{notification.message}</p>
                                    <p className="text-xs text-gray-400">{notification.time}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <BellIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p className="text-gray-500">No new notifications</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default Notifications;
