import  {PrismaClient}  from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
export const verifyToken = async(req, res, next) => {
  try {
    const token = req.cookies.token   
  if(!token) {
    return res.status(401).json({
      message: "Unauthorized"
    })
  }
 const decoded = jwt.verify(token, process.env.JWT_SECRET)
 if(!decoded && !decoded.id) {
   return res.status(401).json({
     message: "Unauthorized"
   })
 }
 const user = await prisma.user.findUnique({
    where: {
      id: decoded.id
    }
  })
  if(!user) {
    return res.status(401).json({
      message: "Unauthorized"
    })
  }
  req.user = {
    id: user.id,
    username: user.username,
  }
  next()
  } catch (error) {
    console.log(error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token invalid.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token Was expires.' });
    }

    // Erreur serveur pour les autres cas
    res.status(500).json({ message: 'internal server error.' });
  
  }
}