import { motion } from 'framer-motion';

const MoodOption = ({ mood, isSelected, onSelect, disabled = false }) => {
  return (
    <motion.button
      onClick={onSelect}
      disabled={disabled}
      className={`w-10 h-10 rounded-full border-2 transition-all duration-200 relative overflow-hidden
                 ${isSelected 
                   ? 'border-gray-800 scale-110' 
                   : 'border-gray-300 hover:border-gray-400'
                 }
                 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
               `}
      style={{ backgroundColor: mood.hex }}
      whileHover={!disabled ? { scale: 1.1 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      title={mood.label}
    >
      {isSelected && (
        <motion.div
          className="absolute inset-0 border-2 border-gray-800 rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </motion.button>
  );
};

export default MoodOption;