import  {PrismaClient} from "@prisma/client";
// import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, subWeeks, subMonths } from "date-fns";


const prisma = new PrismaClient()

export const getNotes = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 10} = req.query;

    const take = parseInt(limit);
    const skip = (parseInt(page) - 1) * take;

    const whereClause = {
      userId: req.user?.id,
      OR: [
        { topic: { contains: search, mode: "insensitive" } },
            { contentText: { contains: search, mode: "insensitive" } },
            { preacher: { contains: search, mode: "insensitive" } },
            { youtubeUrl: { contains: search, mode: "insensitive" } },
      ],
    };

    // ⏱️ Appliquer les filtres temporels
    // const now = new Date();

    // if (filter === "this_week") {
    //   whereClause.createdAt = {
    //     gte: startOfWeek(now, { weekStartsOn: 1 }),
    //     lte: endOfWeek(now, { weekStartsOn: 1 }),
    //   };
    // } else if (filter === "last_week") {
    //   const lastWeekStart = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
    //   const lastWeekEnd = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
    //   whereClause.createdAt = { gte: lastWeekStart, lte: lastWeekEnd };
    // } else if (filter === "this_month") {
    //   whereClause.createdAt = {
    //     gte: startOfMonth(now),
    //     lte: endOfMonth(now),
    //   };
    // } else if (filter === "last_month") {
    //   const lastMonth = subMonths(now, 1);
    //   whereClause.createdAt = {
    //     gte: startOfMonth(lastMonth),
    //     lte: endOfMonth(lastMonth),
    //   };
    // }

    const notes = await prisma.note.findMany({
      where: whereClause,
      orderBy: { updatedAt: "desc" },
      take,
      skip,
    });

    const total = await prisma.note.count({ where: whereClause });

    res.status(200).json({
      notes,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / take),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};




export const getNote =async (req,res) => {
  try{
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
  }catch(error){
    console.log(error)
    res.status(500).json({
      message:"Something went wrong"
    })
  }
}
