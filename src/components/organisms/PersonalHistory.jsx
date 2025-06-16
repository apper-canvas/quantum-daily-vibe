import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import ThoughtBubble from '@/components/molecules/ThoughtBubble';
import ApperIcon from '@/components/ApperIcon';

const PersonalHistory = ({ entries, onClose }) => {
  const groupedEntries = useMemo(() => {
    const groups = {};
    
    entries.forEach(entry => {
      const date = new Date(entry.timestamp);
      let dateKey;
      
      if (isToday(date)) {
        dateKey = 'Today';
      } else if (isYesterday(date)) {
        dateKey = 'Yesterday';
      } else {
        dateKey = format(date, 'MMMM d, yyyy');
      }
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(entry);
    });
    
    return groups;
  }, [entries]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-background rounded-2xl shadow-lift max-w-2xl w-full max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ApperIcon name="BookOpen" className="w-5 h-5 text-primary" />
            <h2 className="font-display text-xl text-gray-800">
              Your Thoughts
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <ApperIcon name="X" className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)] scrollbar-hide">
          {Object.entries(groupedEntries).map(([dateKey, dateEntries]) => (
            <div key={dateKey} className="mb-8 last:mb-0">
              <h3 className="font-medium text-gray-700 mb-4 sticky top-0 bg-background py-2">
                {dateKey}
              </h3>
              <div className="space-y-4">
                {dateEntries.map(entry => (
                  <ThoughtBubble key={entry.Id} entry={entry} showOwn />
                ))}
              </div>
            </div>
          ))}
          
          {entries.length === 0 && (
            <div className="text-center py-12">
              <ApperIcon name="PenTool" className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No thoughts yet</p>
              <p className="text-gray-400 text-sm mt-1">
                Start sharing your daily vibes
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PersonalHistory;