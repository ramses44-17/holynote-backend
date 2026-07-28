import express from "express"
import { getBooks } from "../bible/controllers/get-books.js"
import {getChapters} from "../bible/controllers/get-chapters.js"



const bibleRouter = express.Router()

bibleRouter.get("/books", getBooks);
// bibleRouter.get("/books/:bookId", getBookById);
bibleRouter.get("/books/:bookId/chapters", getChapters);

export default bibleRouter

