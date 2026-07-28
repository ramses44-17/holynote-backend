import bibleService from "../services/bible.service.js";
import { bookIdParamsSchema } from "../../../schemas/bible.schemas.js";

export const getChapters = async (req, res) => {
  const paramsValidation = bookIdParamsSchema.safeParse(req.params);

  if (!paramsValidation.success) {
    return res.status(422).json({
      message: paramsValidation.error.errors[0].message,
    });
  }

  try {
    const { bookId } = paramsValidation.data;

    const chapterCount = bibleService.getChapterCount(bookId);

    res.set("Cache-Control", "public, max-age=31536000, immutable");

    return res.status(200).json({ chapterCount });
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