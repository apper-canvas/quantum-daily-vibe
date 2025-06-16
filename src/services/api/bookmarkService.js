let bookmarks = [];
let idCounter = 1;

const delay = () => new Promise(resolve => setTimeout(resolve, 200));

const bookmarkService = {
  async getAll() {
    await delay();
    return [...bookmarks].sort((a, b) => b.timestamp - a.timestamp);
  },

  async getById(id) {
    await delay();
    const bookmark = bookmarks.find(b => b.Id === parseInt(id));
    return bookmark ? { ...bookmark } : null;
  },

  async create(entryId) {
    await delay();
    const existingBookmark = bookmarks.find(b => b.entryId === parseInt(entryId));
    if (existingBookmark) {
      throw new Error('Entry already bookmarked');
    }
    
    const newBookmark = {
      Id: idCounter++,
      entryId: parseInt(entryId),
      timestamp: Date.now()
    };
    bookmarks.push(newBookmark);
    return { ...newBookmark };
  },

  async delete(id) {
    await delay();
    const index = bookmarks.findIndex(b => b.Id === parseInt(id));
    if (index !== -1) {
      const deleted = bookmarks.splice(index, 1)[0];
      return { ...deleted };
    }
    throw new Error('Bookmark not found');
  },

  async deleteByEntryId(entryId) {
    await delay();
    const index = bookmarks.findIndex(b => b.entryId === parseInt(entryId));
    if (index !== -1) {
      const deleted = bookmarks.splice(index, 1)[0];
      return { ...deleted };
    }
    throw new Error('Bookmark not found');
  }
};

export default bookmarkService;