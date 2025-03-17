import z from "zod"
import  {PrismaClient}  from "@prisma/client"



const prisma = new PrismaClient()
const noteSchema = z.object({
  noteId:z.string({
    message:"Note id is required"
  }).uuid({
    message:"Invalid id"
  })})
export const deleteNote = async(req,res) => {
try {
const result = noteSchema.safeParse(req.params)
const {noteId} = req.params
if(!result.success){
  return res.status(422).json({
    message: result.error?.errors[0].message
  })
}
const noteToDelete = await prisma.note.findUnique({
  where:{
    id:noteId,userId:req.user?.id
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
  deletedNote
)
} catch (error) {
  console.log(error)
  res.status(500).json({
    message:"something went wrong !"
  })
}
}


