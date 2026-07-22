import { PrismaClient } from "@prisma/client";
import  noteSchema, { noteIdSchema} from "../../../schemas/note.schemas.js";

const prisma = new PrismaClient();

const updateNote = async (req, res) => {
  try {
    const bodyValidation = noteSchema.safeParse(req.body);
    const paramsValidation = noteIdSchema.safeParse(req.params);

    if (!paramsValidation.success) {
      return res.status(422).json({
        message: paramsValidation.error?.errors[0].message,
      });
    }

    if (!bodyValidation.success) {
      return res.status(422).json({
        message: bodyValidation.error?.errors[0].message,
      });
    }

    const { noteId } = req.params;
    const { topic, content, contentHTML, contentJSON } = req.body;

    const oldNote = await prisma.note.findUnique({
      where: { id: noteId, userId: req.user?.id },
    });

    if (!oldNote) {
      return res.status(404).json({
        message: "note not found",
      });
    }

    let finalContentJson;
    let finalContentHtml;
    let finalContentText;

    if (content === null || content === undefined) {
      finalContentJson = oldNote.contentJSON;
      finalContentHtml = oldNote.contentHTML;
      finalContentText = oldNote.contentText;
    } else {
      const isEmpty = content.trim() === "";
      finalContentHtml = isEmpty ? null : contentHTML;
      finalContentJson = isEmpty ? null : contentJSON;
      finalContentText = isEmpty ? null : content;
    }

    const updatedNote = await prisma.note.update({
      where: { id: noteId, userId: req.user?.id },
      data: {
        contentText: finalContentText,
        contentJSON: finalContentJson,
        contentHTML: finalContentHtml,
        topic: topic ? topic : oldNote.topic,
      },
    });

    res.status(200).json(updatedNote);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "something went wrong",
    });
  }
};

export default updateNote;