import jwt from "jsonwebtoken"
import { PrismaClient } from "@prisma/client"
import { addDays } from "date-fns";

const prisma = new PrismaClient()

export const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken
  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token missing" })
  }

  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include:{user:true}
  })

  if (
    !storedToken ||
    storedToken.revoked ||
    storedToken.expiresAt < new Date()
  ) {
    return res.status(401).json({ message: "Invalid or expired refresh token" })
  }

  // Optionnel : invalider le token actuel (rotation)
  await prisma.refreshToken.update({
    where: { token: refreshToken },
    data: { revoked: true }
  })

  const newRefreshToken = jwt.sign(
        { id: storedToken.userId },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES }
      );

  const newAccessToken = jwt.sign({ id: storedToken.user.id}, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES })

  await prisma.refreshToken.create({
    data: {
      token: newRefreshToken,
      userId: storedToken.userId,
      expiresAt: addDays(new Date(), 7),
    },
  })


  res.cookie("accessToken", newAccessToken, {
    httpOnly: true,
    sameSite: "None",
    secure: true,
    // path: "/api/auth", 
    maxAge: 15 * 60 * 1000,
  })

  // Cookie côté web
  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    sameSite: "None",
    secure: true,
    // path: "/api/auth", 
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })

  res.status(200).json({
    message:"Token refreshed successfuly",
  })
  } catch (error) {
    console.log(error);
    res.status(500).json({
       message: "Internal Server Error" 
    })
  }
}
