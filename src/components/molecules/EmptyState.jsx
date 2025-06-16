import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const EmptyState = ({ title, description, showAction = false }) => {
  return (
    <motion.div
      className="text-center py-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-md mx-auto">
        <motion.div
          className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary to-secondary rounded-full 
                   flex items-center justify-center"
          animate={{ 
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <ApperIcon name="MessageCircle" className="w-12 h-12 text-white" />
        </motion.div>

        <h3 className="font-display text-2xl text-gray-800 mb-3">
          {title}
        </h3>
        <p className="text-gray-600 text-lg text-balance mb-6">
          {description}
        </p>

        {showAction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            <p className="text-primary font-medium">
              Share the first thought ✨
            </p>
            <div className="flex justify-center">
              <ApperIcon name="ArrowLeft" className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-500 ml-2">
                Use the form on the left to get started
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default EmptyState;