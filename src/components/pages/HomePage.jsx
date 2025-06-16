import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import EntryInput from '@/components/organisms/EntryInput';
import FeedContainer from '@/components/organisms/FeedContainer';
import PersonalHistory from '@/components/organisms/PersonalHistory';
import TimeRestriction from '@/components/molecules/TimeRestriction';
import EmptyState from '@/components/molecules/EmptyState';
import { entryService, userDataService } from '@/services';

const HomePage = () => {
  const [entries, setEntries] = useState([]);
  const [userEntries, setUserEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canPost, setCanPost] = useState(false);
  const [timeUntilNext, setTimeUntilNext] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [feedOffset, setFeedOffset] = useState(0);
  const [hasMoreEntries, setHasMoreEntries] = useState(true);
  const feedRef = useRef(null);

  const loadFeedEntries = async (offset = 0, reset = false) => {
    try {
      const feedEntries = await entryService.getFeed(20, offset);
      if (reset) {
        setEntries(feedEntries);
      } else {
        setEntries(prev => [...prev, ...feedEntries]);
      }
      setHasMoreEntries(feedEntries.length === 20);
      setFeedOffset(offset + feedEntries.length);
    } catch (error) {
      toast.error('Failed to load entries');
    }
  };

  const loadUserData = async () => {
    try {
      const [canPostResult, timeRemaining, userEntriesResult] = await Promise.all([
        userDataService.canPost(),
        userDataService.getTimeUntilNextPost(),
        entryService.getUserEntries()
      ]);
      
      setCanPost(canPostResult);
      setTimeUntilNext(timeRemaining);
      setUserEntries(userEntriesResult);
    } catch (error) {
      toast.error('Failed to load user data');
    }
  };

  useEffect(() => {
    const initializeApp = async () => {
      setLoading(true);
      await Promise.all([
        loadFeedEntries(0, true),
        loadUserData()
      ]);
      setLoading(false);
    };

    initializeApp();
  }, []);

  useEffect(() => {
    if (timeUntilNext > 0) {
      const timer = setInterval(() => {
        setTimeUntilNext(prev => {
          const newTime = Math.max(0, prev - 1000);
          if (newTime === 0) {
            setCanPost(true);
          }
          return newTime;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeUntilNext]);

  const handleEntrySubmit = async (entryData) => {
    try {
      const newEntry = await entryService.create(entryData);
      await userDataService.addEntry(newEntry);
      
      setEntries(prev => [newEntry, ...prev]);
      setUserEntries(prev => [newEntry, ...prev]);
      setCanPost(false);
      setTimeUntilNext(24 * 60 * 60 * 1000); // 24 hours
      
      toast.success('Your thought has been shared with the world ✨');
    } catch (error) {
      toast.error('Failed to share your thought');
    }
  };

  const handleLoadMore = () => {
    if (hasMoreEntries && !loading) {
      loadFeedEntries(feedOffset);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-primary font-display text-xl"
        >
          Loading thoughts...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.header 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-display text-4xl md:text-5xl text-primary mb-4">
            DailyVibe
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto text-balance">
            A space for anonymous daily thoughts. One sentence, infinite connection.
          </p>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Entry Input Section */}
          <motion.div 
            className="lg:col-span-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="sticky top-8 space-y-6">
              {canPost ? (
                <EntryInput onSubmit={handleEntrySubmit} />
              ) : (
                <TimeRestriction timeRemaining={timeUntilNext} />
              )}
              
              {userEntries.length > 0 && (
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="w-full px-4 py-3 bg-white rounded-2xl shadow-soft border border-gray-100 
                           hover:shadow-lift transition-all duration-200 text-gray-700 font-medium"
                >
                  {showHistory ? 'Hide' : 'Show'} Your Thoughts ({userEntries.length})
                </button>
              )}
            </div>
          </motion.div>

          {/* Feed Section */}
          <motion.div 
            className="lg:col-span-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {entries.length === 0 ? (
              <EmptyState 
                title="No thoughts yet"
                description="Be the first to share your daily vibe with the world"
                showAction={canPost}
              />
            ) : (
              <FeedContainer
                entries={entries}
                onLoadMore={handleLoadMore}
                hasMore={hasMoreEntries}
                ref={feedRef}
              />
            )}
          </motion.div>
        </div>

        {/* Personal History Sidebar */}
        <AnimatePresence>
          {showHistory && (
            <PersonalHistory
              entries={userEntries}
              onClose={() => setShowHistory(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HomePage;