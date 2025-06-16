import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const TimeRestriction = ({ timeRemaining }) => {
  const formatTime = (milliseconds) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const progress = 1 - (timeRemaining / (24 * 60 * 60 * 1000));
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <motion.div
      className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100 text-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#F3F4F6"
              strokeWidth="6"
              fill="none"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              stroke="#6B5B95"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <ApperIcon name="Clock" className="w-8 h-8 text-primary" />
          </div>
        </div>

        <div>
          <h3 className="font-display text-xl text-gray-800 mb-2">
            One thought per day
          </h3>
          <p className="text-gray-600 mb-2">
            You can share your next thought in
          </p>
          <p className="font-bold text-2xl text-primary">
            {formatTime(timeRemaining)}
          </p>
        </div>

        <p className="text-sm text-gray-500 max-w-sm text-balance">
          Take time to reflect. The best thoughts come from moments of pause.
        </p>
      </div>
    </motion.div>
  );
};

export default TimeRestriction;