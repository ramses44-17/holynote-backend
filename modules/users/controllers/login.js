import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
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
  const isValid = await bcrypt.compare(password, user.password)
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
    httpOnly: true, // Empêche l'accès au cookie via JavaScript côté client
    sameSite: "Lax", // Protège contre les attaques CSRF
    secure: process.env.NODE_ENV === "production", // Cookie uniquement envoyé sur HTTPS en production
    maxAge: 86400000, // Durée de validité du cookie : 1 jour en millisecondes
  });
  res.status(200).json({
    message: "Login successful",
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