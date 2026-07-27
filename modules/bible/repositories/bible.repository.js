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

      // getBookById: db.prepare(`
      //   SELECT
      //     book_number AS id,
      //     short_name AS shortName,
      //     long_name AS longName
      //   FROM books
      //   WHERE book_number = ?
      // `),

      // findBookByName: db.prepare(`
      //   SELECT
      //     book_number AS id,
      //     short_name AS shortName,
      //     long_name AS longName
      //   FROM books
      //   WHERE
      //     LOWER(short_name) = LOWER(?)
      //     OR LOWER(long_name) = LOWER(?)
      // `),

      // getVerses: db.prepare(`
      //   SELECT
      //     verse,
      //     text
      //   FROM verses
      //   WHERE
      //     book_number = ?
      //     AND chapter = ?
      //   ORDER BY verse
      // `),

      // getVerse: db.prepare(`
      //   SELECT
      //     verse,
      //     text
      //   FROM verses
      //   WHERE
      //     book_number = ?
      //     AND chapter = ?
      //     AND verse = ?
      // `),

      // getVerseRange: db.prepare(`
      //   SELECT
      //     verse,
      //     text
      //   FROM verses
      //   WHERE
      //     book_number = ?
      //     AND chapter = ?
      //     AND verse BETWEEN ? AND ?
      //   ORDER BY verse
      // `),

      // getStories: db.prepare(`
      //   SELECT
      //     verse,
      //     title
      //   FROM stories
      //   WHERE
      //     book_number = ?
      //     AND chapter = ?
      //   ORDER BY verse
      // `)
    };
  }

  getBooks() {
    return this.queries.getBooks.all();
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