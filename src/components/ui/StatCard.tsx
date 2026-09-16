import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon?: ReactNode;
  color?: 'blue' | 'yellow' | 'green' | 'gray' | 'purple' | 'red';
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color = 'blue',
  subtitle,
}) => {
  const colorClasses = {
    blue: 'bg-gradient-to-br from-blue-500 to-blue-600',
    yellow: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
    green: 'bg-gradient-to-br from-green-500 to-green-600',
    gray: 'bg-gradient-to-br from-gray-500 to-gray-600',
    purple: 'bg-gradient-to-br from-purple-500 to-purple-600',
    red: 'bg-gradient-to-br from-red-500 to-red-600',
  };

  return (
    <motion.div
      className={`stat-card ${colorClasses[color]} flex-1 min-w-[200px]`}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-white/90 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-white mb-1">{value}</p>
          {subtitle && (
            <p className="text-white/70 text-xs">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
