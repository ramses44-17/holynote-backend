import { z } from "zod";
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
// Regex pour valider les URLs YouTube et extraire l'ID
const youtubeUrlRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
const noteSchema = z.object({
  topic: z.string({
    message:"topic is required"
  }).min(1, "topic is required").max(60, "topic must be no longer than 60 characters"),
  content: z.string().optional(), // Peut être une chaîne vide
  color: z.string().max(10).default("red"),
  references: z.string().regex(/^([a-zA-Z]+\s\d{1,3}(:\d{1,3}(-\d{1,3})?)?,?\s?)+$/,{
    message:"invalid references format"
  }).optional(),
  youtubeUrl: z.string().url("invalid youtube url").regex(youtubeUrlRegex, "invalid youtube url").optional().nullable(),
  preacher: z.string({
    message:"preacher name is required"
  }).min(1, "preacher is required").max(60, "Le nom du prédicateur ne doit pas dépasser 60 caractères"),
  date: z.string({
    message:"date is required"
  }).date(
    "invalid date format,please provide date in YYYY-MM-DD"
  )
})

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


const addNote = async(req,res) => {
try {
  const {topic,content,color, references, youtubeUrl,date,preacher} = req.body

const result = noteSchema.safeParse({topic,content,color,references,youtubeUrl,date,preacher})
      
if(!result.success){
  return res.status(422).json({
    message: result.error?.errors[0].message
  })
}
const youtubeId = extractYouTubeId(youtubeUrl)
const referencesArray = separateReferences(references)


const createdNote = await prisma.note.create({
  data:{
    userId:req.user.id,
    topic:topic,
    content:content,
    color:color,
    references:referencesArray,
    youtubeId:youtubeId,
    date:date,
    preacher:preacher
  }
})
  res.status(201).json({
    note:createdNote
  })

} catch (e) {
  console.log(e);
  res.status(500).json({
    message:"something went wrong !"
  })
}
}


export default addNote
