import { PrismaClient} from "@prisma/client";
import z from "zod"


const prisma = new PrismaClient()


const youtubeUrlRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

// Regex pour s'assurer que la date est bien au format "YYYY-MM-DD"
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return (!isNaN(date.getTime()) && dateString === date.toISOString().split("T")[0]) || dateRegex.test(date);
};
const noteSchema = z.object({
  noteId:z.string({
    message:"note id is required"
  }).uuid({
    message:"invalid id"
  }),
  topic: z.string({
    message:"topic is required"
  }).min(1, "topic is required").max(60, "topic must be no longer than 60 characters").optional(),
  content: z.string().optional(), // Peut être une chaîne vide
  color: z.string().max(10).default("red"),
  references: z.string().regex(/^([a-zA-Z]+\s\d{1,3}(:\d{1,3}(-\d{1,3})?)?,?\s?)+$/,{
    message:"invalid references format"
  }).optional(),
  youtubeUrl: z.string().url("invalid youtube url").regex(youtubeUrlRegex, "invalid youtube url").optional().nullable(),
  preacher: z.string({
    message:"preacher name is required"
  }).min(1, "preacher is required").max(60, "Le nom du prédicateur ne doit pas dépasser 60 caractères").optional(),
  date: z.string().optional(),
}).refine((data) => {
  if (!data.date) {
    return isValidDate(data.date)
  }
}
, "invalid date format");

const extractYouTubeId = (url) => {
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
    const result = noteSchema.safeParse(req.body)
      
if(!result.success){
  return res.status(422).json({
    message: result.error?.errors[0].message
  })
}

const {topic,content,color, references, youtubeUrl,date,preacher} = req.body

//trouver la note
const oldNote = await prisma.note.findUnique({
  where:{id:noteId}
})
if(!oldNote){
  return res.status(404).json({
    message:"note not found"
  })
}
let youtubeId = null
let referencesArray = null
if(youtubeUrl){
  youtubeId = extractYouTubeId(youtubeUrl)
}
if(references){
  referencesArray = separateReferences(references)
}
  const updatedNote = await prisma.note.update({
    where:{id:noteId,userId:req.user?.id},
    data:{content:content ? content : oldNote.content,
    topic:topic ? topic : oldNote.topic,
    date:date ? date:oldNote.date,
    preacher:preacher ? preacher:oldNote.preacher,
    color:color ? color :oldNote.color,
    references:referencesArray ? referencesArray : oldNote.references,
    youtubeId:youtubeId ? youtubeId : oldNote.youtubeId
    }
  })

  res.status(200).json(updatedNote)
  } catch (error) {
    res.status(500).json({
      message:"something went wrong"
    })
  }
}


export default updateNote