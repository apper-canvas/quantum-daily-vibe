import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import EntryInput from "@/components/organisms/EntryInput";
import FeedContainer from "@/components/organisms/FeedContainer";
import PersonalHistory from "@/components/organisms/PersonalHistory";
import TimeRestriction from "@/components/molecules/TimeRestriction";
import EmptyState from "@/components/molecules/EmptyState";
import { bookmarkService, entryService, userDataService, promptService } from "@/services";
import BookmarksModal from "@/components/organisms/BookmarksModal";
import DailyPromptBanner from "@/components/molecules/DailyPromptBanner";

const HomePage = () => {
const [entries, setEntries] = useState([]);
  const [userEntries, setUserEntries] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [bookmarkedEntries, setBookmarkedEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canPost, setCanPost] = useState(false);
  const [timeUntilNext, setTimeUntilNext] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [feedOffset, setFeedOffset] = useState(0);
  const [hasMoreEntries, setHasMoreEntries] = useState(true);
  const [userRecentMoods, setUserRecentMoods] = useState([]);
  const [similarEntries, setSimilarEntries] = useState(new Set());
  const [showPromptBanner, setShowPromptBanner] = useState(true);
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
      const [canPostResult, timeRemaining, userEntriesResult, recentMoods, bookmarksResult] = await Promise.all([
        userDataService.canPost(),
        userDataService.getTimeUntilNextPost(),
        entryService.getUserEntries(),
        entryService.getUserRecentMoods(7),
        bookmarkService.getAll()
      ]);
      
      setCanPost(canPostResult);
      setTimeUntilNext(timeRemaining);
      setUserEntries(userEntriesResult);
      setUserRecentMoods(recentMoods);
      setBookmarks(bookmarksResult);
      
      // Load bookmarked entries
      if (bookmarksResult.length > 0) {
        const entryIds = bookmarksResult.map(b => b.entryId);
        const bookmarkedEntriesResult = await entryService.getBookmarkedEntries(entryIds);
        setBookmarkedEntries(bookmarkedEntriesResult);
      }
      
      // Calculate similar entries based on recent moods
      if (recentMoods.length > 0) {
        const similarIds = await entryService.calculateSimilarEntries(recentMoods);
        setSimilarEntries(similarIds);
      }
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
      
      // Update recent moods and recalculate similar entries
      const updatedMoods = await entryService.getUserRecentMoods(7);
      setUserRecentMoods(updatedMoods);
      const similarIds = await entryService.calculateSimilarEntries(updatedMoods);
      setSimilarEntries(similarIds);
      
      toast.success('Your thought has been shared with the world ✨');
    } catch (error) {
      toast.error('Failed to share your thought');
    }
};

  const handleBookmark = async (entryId) => {
    try {
      const existingBookmark = bookmarks.find(b => b.entryId === entryId);
      
      if (existingBookmark) {
        // Remove bookmark
        await bookmarkService.delete(existingBookmark.Id);
        setBookmarks(prev => prev.filter(b => b.Id !== existingBookmark.Id));
        setBookmarkedEntries(prev => prev.filter(e => e.Id !== entryId));
        toast.success('Bookmark removed');
      } else {
        // Add bookmark
        const newBookmark = await bookmarkService.create(entryId);
        const entry = entries.find(e => e.Id === entryId);
        if (entry) {
          setBookmarks(prev => [newBookmark, ...prev]);
          setBookmarkedEntries(prev => [entry, ...prev]);
          toast.success('Entry bookmarked');
        }
      }
    } catch (error) {
      toast.error('Failed to update bookmark');
    }
  };

  const isEntryBookmarked = (entryId) => {
    return bookmarks.some(b => b.entryId === entryId);
  };

  const handleLoadMore = () => {
    if (hasMoreEntries && !loading) {
      loadFeedEntries(feedOffset);
}
  };

  const handlePromptDismiss = () => {
    setShowPromptBanner(false);
    promptService.dismissForToday();
  };

  useEffect(() => {
    // Check if prompt banner should be shown
    setShowPromptBanner(!promptService.isDismissedForToday());
  }, []);

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

        <AnimatePresence>
          {showPromptBanner && (
            <DailyPromptBanner onDismiss={handlePromptDismiss} />
          )}
        </AnimatePresence>

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
              
<div className="space-y-3">
                {userEntries.length > 0 && (
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="w-full px-4 py-3 bg-white rounded-2xl shadow-soft border border-gray-100 
                             hover:shadow-lift transition-all duration-200 text-gray-700 font-medium"
                  >
                    {showHistory ? 'Hide' : 'Show'} Your Thoughts ({userEntries.length})
                  </button>
                )}
                
                {bookmarkedEntries.length > 0 && (
                  <button
                    onClick={() => setShowBookmarks(!showBookmarks)}
                    className="w-full px-4 py-3 bg-white rounded-2xl shadow-soft border border-gray-100 
                             hover:shadow-lift transition-all duration-200 text-gray-700 font-medium"
                  >
                    {showBookmarks ? 'Hide' : 'Show'} Your Bookmarks ({bookmarkedEntries.length})
                  </button>
                )}
              </div>
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
                userRecentMoods={userRecentMoods}
                similarEntries={similarEntries}
                bookmarks={bookmarks}
                onBookmark={handleBookmark}
                isEntryBookmarked={isEntryBookmarked}
                ref={feedRef}
              />
            )}
          </motion.div>
        </div>

{/* Personal History & Bookmarks Modals */}
        <AnimatePresence>
          {showHistory && (
            <PersonalHistory
              entries={userEntries}
              onClose={() => setShowHistory(false)}
            />
          )}
          {showBookmarks && (
            <BookmarksModal
              entries={bookmarkedEntries}
              onClose={() => setShowBookmarks(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HomePage;