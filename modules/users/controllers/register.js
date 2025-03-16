import z from "zod"
import  PrismaClient  from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()
const schema = z.object({
  username: z.string({
    message: "Username is required"
  }).min(3,{
    message: "Username must be at least 3 characters long"
  }),
  email: z.string({
    message: "Email is required"
  }).email(),
  password: z.string().min(8,{
    message: "Password must be at least 8 characters long"
  }).max(60,{
    message: "Password must be at most 60 characters long"
  }),
  confirmPassword: z.string({
    message: "Confirm password is required"
  })}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
})
const register =async (req,res) => {
  const {username, email, password,confirmPassword} = req.body

    try {
      const result = schema.safeParse({username, email, password, confirmPassword})
      
    if(!result.success){
      return res.status(422).json({
        message: result.error?.errors[0].message
      })
    }
    const existingUser = await prisma.user.findUnique({
      where: {
        email
      }
    }) 
    if(existingUser){
      return res.status(409).json({
        message: "User already exists"
      })
    }
    const salt = await bcrypt.genSalt(12)
    const hashedPassword = await bcrypt.hash(password, salt)

    await prisma.user.create({
      data: {
        username,
        email,
        password:hashedPassword
      }
    })
    res.status(201).json({
      message: "User registered successfully"
    })

    } catch (error) {
      console.log(error)
      res.status(500).json({
        message: "Something went wrong"
      })
    }
}

export default register