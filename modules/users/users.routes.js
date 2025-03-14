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
userRouter.post("/logout",verifyToken, (req,res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
  res.json({
    message: "Logged out"
  })
})

export default userRouter