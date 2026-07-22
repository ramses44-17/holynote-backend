import  z from "zod";
import {youtubeUrlRegex,BiblicreferencesRegex} from "../lib/utils.js"

const  noteSchema = z.object({
  topic: z.string({
    message:"Topic is required"
  }).min(1, "Topic is required").max(60, "Topic must be no longer than 60 characters"),
  contentText: z.string().nullable().optional(),
  contentHTML: z.string().nullable().optional(),
  contentJSON: z.record(z.any()).nullable().optional(),
})


export const noteIdSchema = z.object({
  noteId:z.string({
    message:"note id is required"
  }).uuid({
    message:"invalid Id"
  })
})


export default noteSchema