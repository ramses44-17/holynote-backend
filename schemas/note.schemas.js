import  z from "zod";
import {youtubeUrlRegex,BiblicreferencesRegex} from "../lib/utils.js"

const  noteSchema = z.object({
  topic: z.string({
    message:"Topic is required"
  }).min(1, "Topic is required").max(60, "Topic must be no longer than 60 characters"),
  contentText: z.string().nullable().optional(),
  contentHTML: z.string().nullable().optional(),
  contentJSON: z.record(z.any()).nullable().optional(),
  biblicalreferences: z.string().regex(
    BiblicreferencesRegex,
    {
      message: "Invalid references format",
    }
  )
  .nullable().optional(),
  youtubeUrl: z.string().url("Invalid youtube url").regex(youtubeUrlRegex, "Invalid youtube url").optional().nullable(),
  preacher: z.string({
    message:"Preacher name is required"
  }).min(1, "Preacher is required").max(60, "Preacher must be no longer than 60 characteres"),
  date: z.string().date({
    message:"Invalid date format,please provide date in YYYY-MM-DD"
  }),
})

export const  updatedNoteSchema = z.object({
  topic: z.string({
    message:"Topic is required"
  }).min(1, "Topic is required").max(60, "Topic must be no longer than 60 characters").optional(),
  contentText: z.string().nullable().optional(),
  contentHTML: z.string().nullable().optional(),
  contentJSON: z.record(z.any()).nullable().optional(),
  references: z.string().refine((val) => !val || BiblicreferencesRegex.test(val), {
    message: "Invalid references format",
  })
  .nullable().optional(),
  youtubeUrl: z.string().optional().nullable().refine((val) => !val || youtubeUrlRegex.test(val), {
    message: "Invalid youtube url",
  }),
  preacher: z.string({
    message:"Preacher name is required"
  }).min(1, "Preacher is required").max(60, "Preacher must be no longer than 60 characteres").optional(),
  date: z.string().date({
    message:"Invalid date format,please provide date in YYYY-MM-DD"
  }).optional(),
})

export const noteIdSchema = z.object({
  noteId:z.string({
    message:"note id is required"
  }).uuid({
    message:"invalid Id"
  })
})


export default noteSchema