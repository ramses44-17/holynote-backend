import  PrismaClient from "@prisma/client";
import z from "zod"


const prisma = new PrismaClient()




const youtubeUrlRegex = /(?:youtube\.com\/(?:.*[?&]v=|(?:watch\?v=|embed\/|v\/|shorts\/|live\/))|youtu\.be\/)([a-zA-Z0-9_-]{11})/


const noteIdSchema = z.object({
  noteId:z.string({
    message:"note id is required"
  }).uuid({
    message:"invalid Id"
  })
})
const noteSchema = z.object({
  
  topic: z.string({
    message:"topic is required"
  }).min(1, "topic is required").max(60, "topic must be no longer than 60 characters").optional(),
  content: z.string().optional(), // Peut être une chaîne vide
  color: z.string().max(10).default("red"),
  references: z.string().regex(
    /^([a-zA-ZÀ-ÿ]+\s\d{1,3}(:\d{1,3}(-\d{1,3})?)?(,\s[a-zA-ZÀ-ÿ]+\s\d{1,3}(:\d{1,3}(-\d{1,3})?)?)*)$/,
    {
      message: "Invalid references format",
    }
  )
  .optional(),
  youtubeUrl: z.string().url("invalid youtube url").regex(youtubeUrlRegex, "invalid youtube url").optional().nullable(),
  preacher: z.string({
    message:"preacher name is required"
  }).min(1, "preacher is required").max(60, "Le nom du prédicateur ne doit pas dépasser 60 caractères").optional(),
  date: z.string().date({
    message:"invalid date format,please provide date in YYYY-MM-DD"
  }).optional(),
})

const extractYouTubeId = (url) => {
  if(!url) return null
  const match = url.match(youtubeUrlRegex);
  return match ? match[1] : null;
};

const separateReferences = (references) => {
  // Si la chaîne est undefined ou vide, retourner un tableau vide
  if (!references) return [];

  // Séparer la chaîne par des virgules, supprimer les espaces et filtrer les éléments vides
  return references
    .split(",")  // Séparer à chaque virgule
    .map((reference) => reference.trim())  // Supprimer les espaces autour de chaque référence
    .filter((reference) => reference.length > 0);  // Enlever les éléments vides
};


const updateNote = async(req,res) => {
  try {
    const bodyValidation = noteSchema.safeParse(req.body)
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
const {topic,content,color, references, youtubeUrl,date,preacher} = req.body

//trouver la note
const oldNote = await prisma.note.findUnique({
  where:{id:noteId,userId:req.user?.id}
})
if(!oldNote){
  return res.status(404).json({
    message:"note not found"
  })
}
let youtubeId = null;
let referencesArray = null;

if (youtubeUrl !== undefined) { // Permet de supprimer youtubeId si youtubeUrl est null
  youtubeId = youtubeUrl ? extractYouTubeId(youtubeUrl) : null;
}

if (references) {
  referencesArray = separateReferences(references);
}

const updatedNote = await prisma.note.update({
  where: { id: noteId, userId: req.user?.id },
  data: {
    content: content ? content : oldNote.content,
    topic: topic ? topic : oldNote.topic,
    date: date ? date : oldNote.date,
    preacher: preacher ? preacher : oldNote.preacher,
    color: color ? color : oldNote.color,
    references: referencesArray ? referencesArray : oldNote.references,
    youtubeId: youtubeId !== undefined ? youtubeId : oldNote.youtubeId, // Permet de le reset
  },
});


  res.status(200).json(updatedNote)
  } catch (error) {
    console.log(error);
    
    res.status(500).json({
      message:"something went wrong"
    })
  }
}


export default updateNote