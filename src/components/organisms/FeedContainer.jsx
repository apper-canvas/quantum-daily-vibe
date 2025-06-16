import { forwardRef, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import ThoughtBubble from '@/components/molecules/ThoughtBubble';
import LoadingState from '@/components/atoms/LoadingState';
import ApperIcon from '@/components/ApperIcon';

const FeedContainer = forwardRef(({ entries, onLoadMore, hasMore }, ref) => {
  const containerRef = useRef(null);
  const observerRef = useRef(null);

  const lastEntryRef = useCallback(node => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        onLoadMore();
      }
    });
    if (node) observerRef.current.observe(node);
  }, [hasMore, onLoadMore]);

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  return (
    <div ref={containerRef} className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <ApperIcon name="MessageCircle" className="w-5 h-5 text-primary" />
        <h2 className="font-display text-xl text-gray-800">
          Collective Thoughts
        </h2>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {entries.map((entry, index) => (
          <motion.div
            key={entry.Id}
            variants={itemVariants}
            ref={index === entries.length - 1 ? lastEntryRef : null}
          >
            <ThoughtBubble entry={entry} />
          </motion.div>
        ))}
      </motion.div>

      {hasMore && (
        <div className="flex justify-center py-8">
          <LoadingState text="Loading more thoughts..." />
        </div>
      )}

      {!hasMore && entries.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <p className="text-gray-500 font-medium">
            You've reached the beginning of time ✨
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Come back tomorrow for new thoughts
          </p>
        </motion.div>
      )}
    </div>
  );
});

FeedContainer.displayName = 'FeedContainer';

export default FeedContainer;