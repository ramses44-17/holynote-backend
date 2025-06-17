import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export const verifyToken = async (req, res, next) => {
  try {
    

    const token = req.cookies?.accessToken


    if(!token) {
       return res.status(401).json({ message: 'Unauthorized: token missing' })
    }


    const decoded = jwt.verify(token, process.env.JWT_SECRET)

//       const revoked = await prisma.revokedAccessToken.findUnique({
//   where: { jti: decoded.jti }
// })

// if (revoked) {
//   return res.status(401).json({ message: 'Unauthorized: Invalid token' })
// }

    if (!decoded?.id) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' })
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    })

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User not found' })
    }

    req.user = {
      id: user.id,
      username: user.username,
      email:user.email
    }

    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' })
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' })
    }

    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
