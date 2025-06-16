import { motion } from 'framer-motion';

const CharacterCounter = ({ current, max }) => {
  const remaining = max - current;
  const percentage = (current / max) * 100;
  
  const getCounterClass = () => {
    if (remaining < 10) return 'character-counter danger';
    if (remaining < 30) return 'character-counter warning';
    return 'character-counter';
  };

  return (
    <div className="flex items-center gap-2">
      <motion.span
        className={getCounterClass()}
        animate={remaining < 10 ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.5, repeat: remaining < 10 ? Infinity : 0 }}
      >
        {remaining}
      </motion.span>
      
      <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full transition-colors duration-200 ${
            remaining < 10 
              ? 'bg-error' 
              : remaining < 30 
                ? 'bg-warning' 
                : 'bg-primary'
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
};

export default CharacterCounter;