import { motion } from 'framer-motion';
import ThoughtBubble from '@/components/molecules/ThoughtBubble';
import ApperIcon from '@/components/ApperIcon';

const BookmarksModal = ({ entries, onClose }) => {
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
            <ApperIcon name="Bookmark" className="w-5 h-5 text-primary" />
            <h2 className="font-display text-xl text-gray-800">
              Your Bookmarks
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
          {entries.length > 0 ? (
            <div className="space-y-4">
              {entries.map(entry => (
                <ThoughtBubble key={entry.Id} entry={entry} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ApperIcon name="Bookmark" className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No bookmarks yet</p>
              <p className="text-gray-400 text-sm mt-1">
                Save interesting thoughts to read later
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BookmarksModal;