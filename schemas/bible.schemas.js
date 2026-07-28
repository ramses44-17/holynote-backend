import { z } from "zod";

export const bookIdParamsSchema = z.object({
  bookId: z.coerce.number().int().positive(),
});

export const chapterParamsSchema = z.object({
  bookId: z.coerce.number().int().positive(),
  chapter: z.coerce.number().int().positive(),
});

// Résout un passage complet en un seul appel : nom de livre (tel que parlé/tapé)
// + chapitre + verset(s) optionnel(s). C'est le point d'entrée que le futur
// module vocal (STT + parser) appellera après avoir extrait la référence.
export const passageQuerySchema = z
  .object({
    book: z.string().min(1),
    chapter: z.coerce.number().int().positive(),
    verse: z.coerce.number().int().positive().optional(),
    endVerse: z.coerce.number().int().positive().optional(),
  })
  .refine(
    (data) => !data.endVerse || !data.verse || data.endVerse >= data.verse,
    {
      message: "endVerse doit être supérieur ou égal à verse",
      path: ["endVerse"],
    }
  );