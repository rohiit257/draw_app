import { Router, Request, Response } from "express";
import { LoginSchema, RegisterSchema } from "../validations/authValidations.js";
import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt'


const router = Router()

// @ts-ignore
router.post("/register", async(req:Request,res:Response)=>{
    try {
        const body  = req.body
        const payload = RegisterSchema.parse(body)

        let user = await 'primsa' 

        if(user){
            return res.status(400).json({message:"User Already Exists"})
        }

        let salt  = await bcrypt.genSalt(10)
        let hashedPassword = await bcrypt.hash(payload.password,salt)

        const Data = await "primsa"

        return res.status(201).json({
            data:Data,
            message:"User Created Successfully"
        })


    } catch (error) {
        //format errir
    }
})

router.post("/login",async(req:Request,res:Response)=>{
    try {
        const body  = req.body
        const payload = LoginSchema.parse(body)

        const user = ""
        if(!user){
            return res.status(404).json({message:"User not found"})
        }

        const salt  =  await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(payload.password,salt)

        const isPwValid = await bcrypt.compare(payload.password,hashedPassword)
        if(!isPwValid){
            return res.status(404).json({message:"Invalid Password"})
        }

        let jwtPayload = {

        }
       
        
        const token = jwt.sign(jwtPayload,process.env.SECRET_KEY!,{expiresIn:"2d"})

        return res.json({
            message:"User LoggedIn Successfully",
            data:{
                ...jwtPayload,
                token : `Bearer ${token}`
            }
        })
    } catch (error) {
        //error handlings
    }
})