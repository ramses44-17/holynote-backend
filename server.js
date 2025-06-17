import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRouter from "./modules/auth/auth.routes.js"
import notesRouter from "./modules/notes/notes.routes.js"
import https from 'https';
import fs from 'fs';
import morgan from "morgan"

const port = process.env.PORT || 3000
const app = express()
app.use(express.json())
app.use(cors({
  origin: "https://holynote.vercel.app",
  credentials: true
}))
app.use(cookieParser())
app.use(morgan('dev'))
app.use("/api/auth",authRouter)
app.use("/api/notes",notesRouter)
app.all('*',(req,res,next)=>{
  res.status(404).json({
    message:"not found"
  })
})

app.listen(port, () => {
  console.log(`Backend HTTPS en écoute...`);
});