import { PrismaClient} from "@prisma/client";


const prisma = new PrismaClient()

export const getNotes = async(req,res) => {

  const notes = await prisma.note.findMany({
    where:{
      userId:req.user?.id
    }
  })

  res.status(200).json({
    notes
  })
}



export const getNote =async (req,res) => {
  const noteId = req.params.noteId
  const note = await prisma.note.findUnique({
    where:{
      id:noteId
    }
  })

  if(note){
    if(note.userId ==! req.user.id){
      return res.status(403).json({
        message:"not authorized"
      })
    }
  }

  res.status(200).json(
    note
  )
}
