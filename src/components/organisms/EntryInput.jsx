import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MoodSelector from '@/components/molecules/MoodSelector';
import CharacterCounter from '@/components/atoms/CharacterCounter';
import SubmitButton from '@/components/atoms/SubmitButton';

const EntryInput = ({ onSubmit }) => {
  const [text, setText] = useState('');
  const [selectedMood, setSelectedMood] = useState('serene');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const maxLength = 150;
  const remainingChars = maxLength - text.length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (text.trim().length === 0 || text.length > maxLength || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        text: text.trim(),
        mood: selectedMood
      });
      setText('');
      setSelectedMood('serene');
    } catch (error) {
      console.error('Failed to submit entry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit(e);
    }
  };

  return (
    <motion.div
      className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="thought-input" className="sr-only">
            Share your daily thought
          </label>
          <textarea
            id="thought-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What's on your mind today? Share one beautiful sentence..."
            className="w-full h-24 resize-none border-0 border-b border-gray-200 focus:border-primary 
                     focus:outline-none font-display text-lg placeholder-gray-400 bg-transparent
                     transition-colors duration-200"
            maxLength={maxLength}
            disabled={isSubmitting}
          />
        </div>

        <div className="flex items-center justify-between">
          <MoodSelector
            selectedMood={selectedMood}
            onMoodChange={setSelectedMood}
            disabled={isSubmitting}
          />
          <CharacterCounter
            current={text.length}
            max={maxLength}
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-gray-500">
            Cmd/Ctrl + Enter to submit
          </p>
          <SubmitButton
            disabled={text.trim().length === 0 || text.length > maxLength || isSubmitting}
            isSubmitting={isSubmitting}
          />
        </div>
      </form>
    </motion.div>
  );
};

export default EntryInput;