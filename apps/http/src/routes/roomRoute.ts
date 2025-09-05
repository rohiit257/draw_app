import { Request, Response, Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { prisma } from "@repo/db/client";
import { Roomschema } from "../validations/authValidations.js";

const router:Router = Router()

router.post("/create-room",authMiddleware,async (req:Request,res:Response)=>{
    try {
        const body = req.body
        const payload = Roomschema.parse(body)
        //@ts-ignore

        const userId = req.userId
       

        const data  = await prisma.room.create({
            data:{
                slug : payload.name,
                adminId: userId
            }
        })

        return res.status(200).json({
            Data : data,
            message : "Room succesfully created"
        })

        
    } catch (error) {
        console.log(error)
        return res.json({message:"Error occured"})
    }

})

export default router