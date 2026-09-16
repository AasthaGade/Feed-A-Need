import { motion } from 'framer-motion';
const ClockIcon = ({ className }: { className?: string }) => (<svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
const CheckCircleIcon = ({ className }: { className?: string }) => (<svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
const ExclamationIcon = ({ className }: { className?: string }) => (<svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>);
const XCircleIcon = ({ className }: { className?: string }) => (<svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
import type { Donation } from '../../types';

interface DonationCardProps {
  donation: Donation;
  onView?: (donation: Donation) => void;
  onApprove?: (id: string) => void;
  onComplete?: (id: string) => void;
  showActions?: boolean;
}

const DonationCard: React.FC<DonationCardProps> = ({
  donation,
  onView,
  onApprove,
  onComplete,
  showActions = false,
}) => {
  const getStatusIcon = () => {
    switch (donation.status) {
      case 'pending':
        return <ExclamationIcon className="h-5 w-5 text-yellow-500" />;
      case 'approved':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-gray-500" />;
      case 'cancelled':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (donation.status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      className="card cursor-pointer"
      whileHover={{ y: -2, shadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
      onClick={() => onView?.(donation)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-800 mb-1">
            {donation.description}
          </h3>
          <p className="text-sm text-gray-600">{donation.donor}</p>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}
          >
            {donation.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">Type</p>
          <p className="text-sm font-medium text-gray-800 capitalize">
            {donation.type}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Method</p>
          <p className="text-sm font-medium text-gray-800 capitalize">
            {donation.method}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Quantity</p>
          <p className="text-sm font-medium text-gray-800">{donation.quantity}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Location</p>
          <p className="text-sm font-medium text-gray-800 truncate">
            {donation.location}
          </p>
        </div>
      </div>

      {donation.amount && (
        <div className="mb-4 p-3 bg-green-50 rounded-lg">
          <p className="text-xs text-gray-600 mb-1">Amount</p>
          <p className="text-2xl font-bold text-green-600">₹{donation.amount}</p>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <ClockIcon className="h-4 w-4" />
          <span>{new Date(donation.timestamp).toLocaleDateString()}</span>
        </div>

        {showActions && donation.status === 'pending' && (
          <div className="flex space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onApprove?.(donation.id);
              }}
              className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors"
            >
              Approve
            </button>
          </div>
        )}

        {showActions && donation.status === 'approved' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onComplete?.(donation.id);
            }}
            className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
          >
            Complete
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default DonationCard;
