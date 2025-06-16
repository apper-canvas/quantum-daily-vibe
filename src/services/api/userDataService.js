const STORAGE_KEY = 'dailyvibe_userdata';

const delay = () => new Promise(resolve => setTimeout(resolve, 200));

const userDataService = {
  async getUserData() {
    await delay();
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return {
      lastPostTime: 0,
      entries: [],
      bookmarks: []
    };
  },

  async updateLastPostTime() {
    await delay();
    const userData = await this.getUserData();
    userData.lastPostTime = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    return userData;
  },

  async canPost() {
    await delay();
    const userData = await this.getUserData();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    const timeSinceLastPost = Date.now() - userData.lastPostTime;
    return timeSinceLastPost >= twentyFourHours;
  },

  async getTimeUntilNextPost() {
    await delay();
    const userData = await this.getUserData();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    const timeSinceLastPost = Date.now() - userData.lastPostTime;
    const timeRemaining = twentyFourHours - timeSinceLastPost;
    return Math.max(0, timeRemaining);
  },

  async addEntry(entry) {
    await delay();
    const userData = await this.getUserData();
    userData.entries.unshift(entry);
    userData.lastPostTime = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    return userData;
  },

  async toggleBookmark(entryId) {
    await delay();
    const userData = await this.getUserData();
    const bookmarkIndex = userData.bookmarks.indexOf(entryId);
    
    if (bookmarkIndex > -1) {
      userData.bookmarks.splice(bookmarkIndex, 1);
    } else {
      userData.bookmarks.push(entryId);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    return userData;
  }
};

export default userDataService;