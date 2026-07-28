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

    getVerses(bookId, chapter) {
    const verses = bibleRepository.getVerses(bookId, chapter);

    if (!verses || verses.length === 0) {
      const error = new Error("Chapitre introuvable");
      error.status = 404;
      throw error;
    }

    return verses;
  }
}

export default new BibleService();