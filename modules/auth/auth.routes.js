import express from "express"
import login from "./controllers/login.js"
import register from "./controllers/register.js"
import { verifyToken } from "../../middlewares/auth.middlewares.js"
import { refresh } from "./controllers/refresh.js"
import { logout } from "./controllers/logout.js"
import { me } from "./controllers/me.js"

const authRouter = express.Router()

authRouter.post("/login",login)
authRouter.post("/register",register)
authRouter.post("/refresh",refresh)
authRouter.post("/logout",verifyToken,logout)
authRouter.get("/me",verifyToken,me)

export default authRouter