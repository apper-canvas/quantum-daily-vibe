import { motion } from 'framer-motion';

const MoodIndicator = ({ mood }) => {
  const moodData = {
    serene: { color: '#88B0D3', label: 'Serene' },
    creative: { color: '#6B5B95', label: 'Creative' },
    warm: { color: '#FF6B6B', label: 'Warm' },
    energetic: { color: '#FFE66D', label: 'Energetic' },
    peaceful: { color: '#4ECDC4', label: 'Peaceful' },
    reflective: { color: '#B8A5C7', label: 'Reflective' },
    grateful: { color: '#F4A261', label: 'Grateful' }
  };

  const currentMood = moodData[mood] || moodData.serene;

  return (
    <motion.div
      className="flex items-center gap-2"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className="w-3 h-3 rounded-full"
        style={{ backgroundColor: currentMood.color }}
      />
      <span className="text-sm font-medium text-gray-600 capitalize">
        {currentMood.label}
      </span>
    </motion.div>
  );
};

export default MoodIndicator;