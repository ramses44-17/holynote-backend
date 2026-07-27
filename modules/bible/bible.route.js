import express from "express"
import { getBooks } from "../bible/controllers/get-books.js"



const bibleRouter = express.Router()

bibleRouter.get("/",getBooks)


export default bibleRouter

