import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken
    const logoutAll = req.body?.logoutAll === true

    const accessToken = req.headers.authorization?.split(" ")[1] // ⬅️ Récupère l'access token

    if (!refreshToken || !accessToken) {
      return res.status(200).json({ message: 'Already logged out' })
    }

    const decodedRefresh = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
    const decodedAccess = jwt.verify(accessToken, process.env.JWT_SECRET)

    if (!decodedRefresh?.id || !decodedAccess?.jti) {
      return res.status(401).json({ message: 'Invalid token' })
    }

    // 🔒 Révoquer l'access token (à condition de l'avoir généré avec un `jti`)
    await prisma.revokedAccessToken.create({
      data: {
        jti: decodedAccess.jti,
        userId: decodedAccess.id,
        revokedAt: new Date(),
      }
    })

    if (logoutAll) {
      await prisma.refreshToken.updateMany({
        where: { userId: decodedRefresh.id, revoked: false },
        data: { revoked: true }
      })
    } else {
      await prisma.refreshToken.updateMany({
        where: { token: refreshToken },
        data: { revoked: true }
      })
    }

    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
    })

    res.status(200).json({
      message: logoutAll ? 'All sessions logged out' : 'Logout successful',
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
