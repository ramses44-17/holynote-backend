import bibleService from "../services/bible.service.js";

export const getBooks = async (req, res) => {
  try {
    const books = bibleService.getBooks();

    // Ce contenu ne change jamais : on laisse aussi le client (navigateur,
    // proxy) le mettre en cache pendant un an, en plus du cache React Query.
    res.set("Cache-Control", "public, max-age=31536000, immutable");
    res.status(200).json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};