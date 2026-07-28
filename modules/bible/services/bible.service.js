import bibleRepository from "../repositories/bible.repository.js";

class BibleService {
  getBooks() {
    return bibleRepository.getBooks();
  }

  getChapterCount(bookId) {
    const chapterCount = bibleRepository.getChapterCount(bookId);

    if (chapterCount === undefined || chapterCount === null) {
      const error = new Error("Livre introuvable");
      error.status = 404;
      throw error;
    }

    return chapterCount;
  }
}

export default new BibleService();