import { motion } from 'framer-motion';
import { format } from 'date-fns';
import MoodIndicator from '@/components/atoms/MoodIndicator';
import ApperIcon from '@/components/ApperIcon';

const ThoughtBubble = ({ entry, showOwn = false, isSimilar = false, isBookmarked = false, onBookmark }) => {
  const moodColors = {
    serene: '#88B0D3',
    creative: '#6B5B95',
    warm: '#FF6B6B',
    energetic: '#FFE66D',
    peaceful: '#4ECDC4',
    reflective: '#B8A5C7',
    grateful: '#F4A261'
  };

  const moodColor = moodColors[entry.mood] || moodColors.serene;

return (
    <motion.div
      className={`thought-bubble relative overflow-hidden ${entry.isOwn ? 'border-l-4 border-primary' : ''} ${isSimilar ? 'ring-1 ring-white ring-opacity-30' : ''}`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      style={{
        background: entry.isOwn 
          ? `linear-gradient(135deg, ${moodColor}10, transparent)`
          : isSimilar
          ? `linear-gradient(135deg, ${moodColor}15, rgba(255, 255, 255, 0.1))`
          : `linear-gradient(135deg, ${moodColor}08, transparent)`
      }}
    >
      <div className="relative z-10">
        <p className="font-display text-lg text-gray-800 leading-relaxed mb-4">
          {entry.text}
        </p>
<div className="flex items-center justify-between">
          <MoodIndicator mood={entry.mood} />
          <div className="flex items-center gap-2 text-sm text-gray-500">
            {showOwn && entry.isOwn && (
              <span className="px-2 py-1 bg-primary bg-opacity-10 text-primary rounded-full text-xs font-medium">
                Yours
              </span>
            )}
            {!entry.isOwn && onBookmark && (
              <motion.button
                onClick={() => onBookmark(entry.Id)}
                className={`p-1.5 rounded-full transition-colors duration-200 hover:bg-gray-100 ${
                  isBookmarked ? 'text-primary bg-primary bg-opacity-10' : 'text-gray-400'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                animate={isBookmarked ? { 
                  scale: [1, 1.2, 1],
                  rotate: [0, 15, -15, 0]
                } : {}}
                transition={{ duration: 0.4 }}
              >
                <ApperIcon name="Bookmark" className="w-4 h-4" />
              </motion.button>
            )}
            <time dateTime={new Date(entry.timestamp).toISOString()}>
              {format(new Date(entry.timestamp), 'MMM d, h:mm a')}
            </time>
          </div>
        </div>
      </div>
      
      {/* Subtle mood gradient overlay */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${moodColor}, transparent)`
        }}
      />
    </motion.div>
  );
};

export default ThoughtBubble;