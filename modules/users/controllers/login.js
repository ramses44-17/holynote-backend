import jwt from "jsonwebtoken"
import bcryptjs from "bcryptjs"
import { PrismaClient } from "@prisma/client"
const login = async(req, res) => {
  try {
    const { email, password } = req.body
  if(!email || !password) {
    return res.status(422).json({
      message: "Email and password are required"
    })
  }
  const prisma = new PrismaClient()
  const user = await prisma.user.findUnique({
    where: {
      email
    }
  })
  if(!user) {
    return res.status(404).json({
      message: "Invalid email or password"
    })
  }
  const isValid = await bcryptjs.compare(password, user.password)
  if(!isValid) {
    return res.status(401).json({
      message: "Invalid email or password"
    })
  }
  const token = jwt.sign({
    id:user.id
  },process.env.JWT_SECRET,{
    expiresIn:process.env.JWT_EXPIRES
  })
  
  res.cookie("token", token, {
    httpOnly: true, 
    sameSite: "None", 
    secure: true, 
    maxAge: 86400000, // Durée de validité du cookie : 1 jour en millisecondes
  });
  res.status(200).json({
    message: "Login successful",
    token:token,
    user:{
      id: user.id,
      username: user.username,
    }
  })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "Internal Server Error"
    })
    
  }
}
 export default login