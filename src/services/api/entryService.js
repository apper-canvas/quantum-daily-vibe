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
  }
};

export default entryService;