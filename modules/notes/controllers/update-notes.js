import  {PrismaClient} from "@prisma/client";
import {separateReferences} from "../../../lib/utils.js"
import {noteIdSchema, updatedNoteSchema} from "../../../schemas/note.schemas.js";


const prisma = new PrismaClient()



const updateNote = async(req,res) => {
  try {
    const bodyValidation = updatedNoteSchema.safeParse(req.body)
    const paramsValidation = noteIdSchema.safeParse(req.params)

    if(!paramsValidation.success){
      return res.status(422).json({
        message: paramsValidation.error?.errors[0].message
      })
    }
      
if(!bodyValidation.success){
  return res.status(422).json({
    message: bodyValidation.error?.errors[0].message
  })
}



const {noteId} = req.params
const {topic,content,references, youtubeUrl,date,preacher,contentHTML,contentJSON} = req.body



const oldNote = await prisma.note.findUnique({
  where:{id:noteId,userId:req.user?.id}
})
if(!oldNote){
  return res.status(404).json({
    message:"note not found"
  })
}


  const updatedNote = await prisma.note.update({
    where:{id:noteId,userId:req.user?.id},
    data:{
      contentText:content ? content : oldNote.contentText,
  contentJSON: contentJSON ? contentJSON : oldNote.contentJSON,
  contentHTML:contentHTML ? contentHTML : oldNote.contentHTML,
  topic: topic ? topic : oldNote.topic,
  date: date ? date : oldNote.date,
  biblicalReferences: references ? separateReferences(references):oldNote.biblicalReferences,
  youtubeUrl:youtubeUrl ? youtubeUrl : oldNote.youtubeUrl,
  preacher: preacher ? preacher : oldNote.preacher
    }
  })

  res.status(200).json(updatedNote)

  } catch (error) {
    console.log(error); 
    res.status(500).json({
      message:"something went wrong"
    })
  }
}


export default updateNote