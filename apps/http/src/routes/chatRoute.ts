import { Request, Response, Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { prisma } from "@repo/db/client";

const router:Router  = Router()



router.get('/chats/:roomId', authMiddleware, async (req:Request,res:Response)=>{
    try {

        const roomId = Number(req.params.roomId)

        const messages = await prisma.chat.findMany({
            where:{
                roomId:roomId
            },
            orderBy:{
                id:"desc"
            },
            take:1000
        })

        return res.json({
            messages
        })

        
    } catch (error) {
        return res.status(404).json({
            message:"No chats"
        })
    }
})

export default router