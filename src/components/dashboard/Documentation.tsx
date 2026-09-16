import { motion } from 'framer-motion';
const BookOpenIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (<svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>);

const Documentation = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
        >
            <div>
                <h1 className="text-4xl font-black mb-3" style={{ color: '#4a1942' }}>
                    Documentation
                </h1>
                <p className="text-lg" style={{ color: '#666' }}>
                    Learn how to use the Feed a Need platform
                </p>
            </div>

            <div className="card">
                <div className="prose max-w-none">
                    <div className="flex items-center gap-3 mb-6">
                        <BookOpenIcon className="w-8 h-8" style={{ color: '#4a1942' }} />
                        <h2 className="text-2xl font-black m-0" style={{ color: '#4a1942' }}>
                            Getting Started
                        </h2>
                    </div>

                    <div className="space-y-8">
                        <section>
                            <h3 className="text-xl font-bold mb-3" style={{ color: '#4a1942' }}>For Donors</h3>
                            <ul className="list-disc pl-5 space-y-2 text-gray-700">
                                <li><strong>Create a Donation:</strong> Go to the Dashboard or Donations page and click "New Donation". Fill in the details about your food or fund donation.</li>
                                <li><strong>Track Status:</strong> View your donations in the dashboard. Statuses include Pending, Approved, and Completed.</li>
                                <li><strong>History:</strong> Check your contribution history in the Analytics tab.</li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="text-xl font-bold mb-3" style={{ color: '#4a1942' }}>For Recipients</h3>
                            <ul className="list-disc pl-5 space-y-2 text-gray-700">
                                <li><strong>Browse Donations:</strong> View available donations on the Dashboard.</li>
                                <li><strong>Request Help:</strong> Contact donors or admins to request specific items (feature coming soon).</li>
                                <li><strong>Notifications:</strong> Enable notifications in Settings to get alerts for new donations.</li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="text-xl font-bold mb-3" style={{ color: '#4a1942' }}>Platform Rules</h3>
                            <p className="text-gray-700 leading-relaxed">
                                We prioritize safety and quality. All food donations must be fresh and within expiration dates.
                                Monetary donations are securely processed and used directly for supporting our hunger relief missions.
                                Users found violating these terms will be banned.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Documentation;
