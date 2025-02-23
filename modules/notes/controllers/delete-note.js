import z from "zod"
import { PrismaClient } from "@prisma/client"


const prisma = new PrismaClient()
const noteSchema = z.object({
  noteId:z.string({
    message:"note id is required"
  }).uuid({
    message:"invalid id"
  })})
export const deleteNote = async(req,res) => {
try {
const result = noteSchema.safeParse(req.body)
const {noteId} = req.body
if(!result.success){
  return res.status(422).json({
    message: result.error?.errors[0].message
  })
}
const noteToDelete = await prisma.note.findUnique({
  where:{
    id:noteId
  }
})

if(!noteToDelete){
  return res.status(404).json({
    message:"note not found"
  })
}
const deletedNote = await prisma.note.delete({
  where: {
      id:noteId,userId:res.user?.id
  },
})
res.status(200).json(
  deleteNote
)
} catch (e) {
  res.status(500).json({
    message:"something went wrong !"
  })
}
}


