import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import userRouter from "./modules/users/users.routes.js"
import notesRouter from "./modules/notes/notes.routes.js"
import https from 'https';
import fs from 'fs';

const options = {
  key: fs.readFileSync('./localhost-key.pem'),
  cert: fs.readFileSync('./localhost.pem'),
};
const port = process.env.PORT || 3000
const app = express()
app.use(express.json())
app.use(cors({
  origin: "https://localhost:5173",
  credentials: true
}))
app.use(cookieParser())
app.use("/api/users",userRouter)
app.use("/api/notes",notesRouter)

https.createServer(options, app).listen(port, () => {
  console.log(`Backend HTTPS en écoute sur https://localhost:${port}`);
});