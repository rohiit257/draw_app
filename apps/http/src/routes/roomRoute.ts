import { Request, Response, Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router()

router.post("/create-room",authMiddleware,(req:Request,res:Response)=>{
    try {
        
    } catch (error) {
        
    }
})