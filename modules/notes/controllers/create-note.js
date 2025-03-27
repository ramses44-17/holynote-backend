import { PrismaClient } from "@prisma/client"
import {separateReferences} from "../../../lib/utils.js"
import noteSchemas from "../../../schemas/note.schemas.js"

const prisma = new PrismaClient()






const addNote = async(req,res) => {
try {
  const {topic,content,contentHTML,contentJSON, references, youtubeUrl,date,preacher} = req.body

const result = noteSchemas.safeParse({topic,contentText:content,contentHTML,contentJSON,biblicalReferences:references,youtubeUrl,date,preacher})
      
if(!result.success){
  return res.status(422).json({
    message: result.error?.errors[0].message
  })
}

const referencesArray = separateReferences(references)


const createdNote = await prisma.note.create({
  data:{
    userId: req.user.id,
    topic,
    contentText: content ?? null,
    contentHTML: contentHTML ?? null,
    contentJSON: contentJSON ?? null,
    biblicalReferences: referencesArray,
    youtubeUrl: youtubeUrl ?? null,
    date: date,
    preacher: preacher
  }
})
  res.status(201).json(createdNote)

} catch (e) {
  console.log(e);
  res.status(500).json({
    message:"something went wrong !"
  })
}
}


export default addNote
