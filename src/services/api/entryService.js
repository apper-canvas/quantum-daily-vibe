import entriesData from '@/services/mockData/entries.json';

let entries = [...entriesData];
let idCounter = Math.max(...entries.map(e => parseInt(e.Id))) + 1;

const delay = () => new Promise(resolve => setTimeout(resolve, 200));

const entryService = {
  async getAll() {
    await delay();
    return [...entries].sort((a, b) => b.timestamp - a.timestamp);
  },

  async getById(id) {
    await delay();
    const entry = entries.find(e => e.Id === parseInt(id));
    return entry ? { ...entry } : null;
  },

  async create(entryData) {
    await delay();
    const newEntry = {
      Id: idCounter++,
      text: entryData.text,
      mood: entryData.mood,
      timestamp: Date.now(),
      isOwn: true
    };
    entries.unshift(newEntry);
    return { ...newEntry };
  },

  async update(id, data) {
    await delay();
    const index = entries.findIndex(e => e.Id === parseInt(id));
    if (index !== -1) {
      entries[index] = { ...entries[index], ...data };
      return { ...entries[index] };
    }
    throw new Error('Entry not found');
  },

  async delete(id) {
    await delay();
    const index = entries.findIndex(e => e.Id === parseInt(id));
    if (index !== -1) {
      const deleted = entries.splice(index, 1)[0];
      return { ...deleted };
    }
    throw new Error('Entry not found');
  },

  async getFeed(limit = 20, offset = 0) {
    await delay();
    const feedEntries = [...entries]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(offset, offset + limit);
    return feedEntries.map(entry => ({ ...entry }));
  },

async getUserEntries() {
    await delay();
    return entries
      .filter(entry => entry.isOwn)
      .sort((a, b) => b.timestamp - a.timestamp)
      .map(entry => ({ ...entry }));
  },

  async getUserRecentMoods(days = 7) {
    await delay();
    const cutoffTime = Date.now() - (days * 24 * 60 * 60 * 1000);
    return entries
      .filter(entry => entry.isOwn && entry.timestamp >= cutoffTime)
      .map(entry => entry.mood);
  },

  async calculateSimilarEntries(userMoods) {
    await delay();
    if (!userMoods || userMoods.length === 0) return new Set();
    
    const moodColors = {
      serene: '#88B0D3',
      creative: '#6B5B95', 
      warm: '#FF6B6B',
      energetic: '#FFE66D',
      peaceful: '#4ECDC4',
      reflective: '#B8A5C7',
      grateful: '#F4A261'
    };

    const getColorSimilarity = (color1, color2) => {
      const hexToHsl = (hex) => {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        
        if (max === min) {
          h = s = 0;
        } else {
          const d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
          }
          h /= 6;
        }
        return [h * 360, s * 100, l * 100];
      };

      const [h1, s1, l1] = hexToHsl(color1);
      const [h2, s2, l2] = hexToHsl(color2);
      
      const hDiff = Math.min(Math.abs(h1 - h2), 360 - Math.abs(h1 - h2));
      const sDiff = Math.abs(s1 - s2);
      const lDiff = Math.abs(l1 - l2);
      
      return (hDiff / 180) * 0.6 + (sDiff / 100) * 0.2 + (lDiff / 100) * 0.2;
    };

    const similarEntryIds = new Set();
    const userMoodColors = userMoods.map(mood => moodColors[mood]);
    
    entries.forEach(entry => {
      if (!entry.isOwn) {
        const entryColor = moodColors[entry.mood];
        const isSimilar = userMoodColors.some(userColor => 
          getColorSimilarity(userColor, entryColor) < 0.3
        );
        if (isSimilar) {
          similarEntryIds.add(entry.Id);
        }
      }
    });
return similarEntryIds;
  },

  async getBookmarkedEntries(bookmarkIds) {
    await delay();
    if (!bookmarkIds || bookmarkIds.length === 0) return [];
    
    const bookmarkedEntries = entries
      .filter(entry => bookmarkIds.includes(entry.Id))
      .sort((a, b) => b.timestamp - a.timestamp);
    
    return bookmarkedEntries.map(entry => ({ ...entry }));
  }
};

export { entryService };