import bibleService from "../services/bible.service.js";
import { chapterParamsSchema } from "../../../schemas/bible.schemas.js";

export const getVerses = async (req, res) => {
  const paramsValidation = chapterParamsSchema.safeParse(req.params);

  if (!paramsValidation.success) {
    return res.status(422).json({
      message: paramsValidation.error.errors[0].message,
    });
  }

  try {
    const { bookId, chapter } = paramsValidation.data;

    const verses = bibleService.getVerses(bookId, chapter);

    res.set("Cache-Control", "public, max-age=31536000, immutable");

    return res.status(200).json(verses);
  } catch (error) {
    if (error.status === 404) {
      return res.status(404).json({
        message: error.message,
      });
    }

    console.error(error);

    return res.status(500).json({
      message: "Something went wrong!",
    });
  }
};