import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const SubmitButton = ({ disabled, isSubmitting }) => {
  return (
    <motion.button
      type="submit"
      disabled={disabled}
      className={`px-6 py-3 rounded-full font-medium text-white transition-all duration-200 relative overflow-hidden
                 ${disabled 
                   ? 'bg-gray-300 cursor-not-allowed' 
                   : 'bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:scale-105'
                 }`}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
    >
      <div className="flex items-center gap-2">
        {isSubmitting ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <ApperIcon name="Loader" className="w-4 h-4" />
            </motion.div>
            <span>Sharing...</span>
          </>
        ) : (
          <>
            <ApperIcon name="Send" className="w-4 h-4" />
            <span>Share</span>
          </>
        )}
      </div>
      
      {!disabled && !isSubmitting && (
        <motion.div
          className="absolute inset-0 bg-white opacity-0 rounded-full"
          whileHover={{ opacity: 0.1 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </motion.button>
  );
};

export default SubmitButton;