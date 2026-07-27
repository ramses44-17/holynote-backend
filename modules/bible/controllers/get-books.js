import bibleService from "../services/bible.service.js";


export const getBooks = async (req, res) => {
  try {
    const books = bibleService.getBooks();

    res.status(200).json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

