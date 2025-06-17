import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { addDays } from "date-fns";
// import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient();

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(422).json({ message: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({
      where: { email }
      // include: { settings: true }, // si tu as une table de settings liée
    });

    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isValid = await bcryptjs.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Access Token (durée courte, ex: 15 min)
    const accessToken = jwt.sign(
      { id: user.id},
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES }
    );

    // Refresh Token (durée longue, ex: 7 jours)
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES }
    );
 
    

    // Optionnel : enregistrer le refresh token en DB
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: addDays(new Date(), 7),
      },
    });


     res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 15 * 60 * 1000, 
      // path:"/api/auth"
    });
    // Envoyer le refresh token dans un cookie sécurisé
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, 
      // path:"/api/auth"
    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        // settings: user.settings, // si disponible
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default login;
