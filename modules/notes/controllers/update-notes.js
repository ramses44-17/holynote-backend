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

let finalContentJson
let finalContentHtml
let finalContentText
console.log(youtubeUrl);

let finalYoutubeUrl = youtubeUrl === null || youtubeUrl === undefined ? oldNote.youtubeUrl : youtubeUrl.trim() === "" ? null : youtubeUrl

let finalBiblicalsReferences = references === null || undefined ? oldNote.biblicalReferences : separateReferences(references)
if (content === null || undefined) { 
  finalContentJson = oldNote.contentJSON
  finalContentHtml = oldNote.contentHTML
  finalContentText = oldNote.contentText
}else {  
  finalContentHtml = content.trim()=== "" ? null : contentHTML
  finalContentJson = content.trim()=== "" ? null : contentJSON
  finalContentText = content.trim() === "" ? null : content
}



  const updatedNote = await prisma.note.update({
    where:{id:noteId,userId:req.user?.id},
    data:{
      contentText:finalContentText,
  contentJSON: finalContentJson,
  contentHTML:finalContentHtml,
  topic: topic ? topic : oldNote.topic,
  date: date ? date : oldNote.date,
  biblicalReferences: finalBiblicalsReferences,
  youtubeUrl:finalYoutubeUrl,
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