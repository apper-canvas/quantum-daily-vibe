import moodData from '@/services/mockData/moods.json';

const delay = () => new Promise(resolve => setTimeout(resolve, 200));

const moodService = {
  async getAll() {
    await delay();
    return [...moodData];
  },

  async getById(id) {
    await delay();
    const mood = moodData.find(m => m.Id === parseInt(id));
    return mood ? { ...mood } : null;
  },

  async getByName(name) {
    await delay();
    const mood = moodData.find(m => m.name === name);
    return mood ? { ...mood } : null;
  }
};

export default moodService;