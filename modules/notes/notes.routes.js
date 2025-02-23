import express from "express"
import addNote from "./controllers/create-note.js"
import { verifyToken } from "../../middlewares/auth.middlewares.js"
import { getNote, getNotes } from "./controllers/get-notes.js"
import updateNote from "./controllers/update-notes.js"
import { deleteNote } from "./controllers/delete-note.js"

const notesRouter = express.Router()

notesRouter.post("/",verifyToken,addNote)
notesRouter.get("/",verifyToken,getNotes)
notesRouter.get("/:noteId",verifyToken,verifyToken,getNote)
notesRouter.patch('/',verifyToken,updateNote)
notesRouter.delete("/",verifyToken,deleteNote)
export default notesRouter