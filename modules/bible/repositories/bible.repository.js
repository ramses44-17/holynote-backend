import db from "../bible.db.js";

class BibleRepository {
  constructor() {
    this.queries = {
      getBooks: db.prepare(`
        SELECT
          book_number AS id,
          short_name AS shortName,
          long_name AS longName
        FROM books
        ORDER BY book_number
      `),
      getChapterCount: db.prepare(`
        SELECT MAX(chapter) AS chapterCount
        FROM verses
        WHERE book_number = ?
      `)
    };
  }

  getBooks() {
    return this.queries.getBooks.all();
  }

  getChapterCount(bookId) {
    const row = this.queries.getChapterCount.get(bookId);
    return row?.chapterCount ?? 0;
  }

  // getBookById(bookId) {
  //   return this.queries.getBookById.get(bookId);
  // }

  // findBookByName(name) {
  //   return this.queries.findBookByName.get(name, name);
  // }

  // getVerses(bookId, chapter) {
  //   return this.queries.getVerses.all(bookId, chapter);
  // }

  // getVerse(bookId, chapter, verse) {
  //   return this.queries.getVerse.get(bookId, chapter, verse);
  // }

  // getVerseRange(bookId, chapter, startVerse, endVerse) {
  //   return this.queries.getVerseRange.all(
  //     bookId,
  //     chapter,
  //     startVerse,
  //     endVerse
  //   );
  // }

  // getStories(bookId, chapter) {
  //   return this.queries.getStories.all(bookId, chapter);
  // }
}

export default new BibleRepository();