const prompts = [
  // Emotional prompts
  "What emotion have you been avoiding lately, and what would happen if you acknowledged it?",
  "Describe a moment today when you felt completely present.",
  "What small joy did you notice today that others might have missed?",
  "If your current mood had a color and texture, what would it be?",
  "What emotion do you wish you could gift to someone today?",
  "How did you show kindness to yourself today?",
  "What feeling surprised you most this week?",
  "If you could have a conversation with your anxiety, what would you ask it?",
  
  // Experience prompts
  "What ordinary moment from today deserves to be remembered?",
  "Describe something you learned about yourself in the past 24 hours.",
  "What conversation are you avoiding, and why?",
  "If today was a chapter in your life story, what would the title be?",
  "What risk are you considering taking, even if it scares you?",
  "Describe a moment when you felt truly understood recently.",
  "What habit are you ready to let go of?",
  "How did you grow today, even in the smallest way?",
  
  // Daily life prompts
  "What made you pause and think 'I'm grateful for this' today?",
  "If you could change one decision you made today, what would it be and why?",
  "What's something simple that brought you peace today?",
  "How did you make someone's day a little brighter?",
  "What are you curious about right now?",
  "Describe the most honest thing you could say about today.",
  "What boundary do you need to set for yourself?",
  "If today's energy was a weather pattern, what would it be?",
  "What question have you been asking yourself lately?",
  "How did you surprise yourself today?",
  "What would you like to remember about this moment in your life?",
  "If you could send a message to yourself from one year ago, what would it say?"
];

// Get a consistent prompt for the current date
const getDailyPrompt = () => {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
  const promptIndex = dayOfYear % prompts.length;
  return prompts[promptIndex];
};

// Check if prompt was dismissed today
const isDismissedForToday = () => {
  const today = new Date().toDateString();
  const dismissedDate = localStorage.getItem('dailyPromptDismissed');
  return dismissedDate === today;
};

// Mark prompt as dismissed for today
const dismissForToday = () => {
  const today = new Date().toDateString();
  localStorage.setItem('dailyPromptDismissed', today);
};

export const promptService = {
  getDaily: getDailyPrompt,
  isDismissedForToday,
  dismissForToday
};