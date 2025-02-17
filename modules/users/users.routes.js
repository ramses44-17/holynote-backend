import express from "express"
import login from "./controllers/login.js"
import register from "./controllers/register.js"
import { verifyToken } from "../../middlewares/auth.middlewares.js"

const userRouter = express.Router()

userRouter.post("/login",login)
userRouter.post("/register",register)
userRouter.get("/me",verifyToken,(req,res) => {
  res.status(200).json({
    user: req.user
  })
})
userRouter.post("/logout", (req,res) => {
  res.clearCookie("token")
  res.json({
    message: "Logged out"
  })
})

export default userRouter