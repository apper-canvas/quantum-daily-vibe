import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { moodService } from '@/services';
import MoodOption from '@/components/atoms/MoodOption';

const MoodSelector = ({ selectedMood, onMoodChange, disabled = false }) => {
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMoods = async () => {
      try {
        const moodData = await moodService.getAll();
        setMoods(moodData);
      } catch (error) {
        console.error('Failed to load moods:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMoods();
  }, []);

  if (loading) {
    return (
      <div className="flex gap-2">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {moods.map((mood) => (
        <MoodOption
          key={mood.Id}
          mood={mood}
          isSelected={selectedMood === mood.name}
          onSelect={() => !disabled && onMoodChange(mood.name)}
          disabled={disabled}
        />
      ))}
    </div>
  );
};

export default MoodSelector;