import { Router, Request, Response } from "express";
import { LoginSchema, RegisterSchema } from "../validations/authValidations.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { JWT_SECRET } from "@repo/backend_common/config";
import { prisma } from "@repo/db/client";

const router: Router = Router();

// @ts-ignore
router.post("/register", async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const payload = RegisterSchema.parse(body);

    let user = await prisma.user.findUnique({
      where: {
        email: payload.email,
      },
    });

    if (user) {
      return res.status(400).json({ message: "User Already Exists" });
    }

    let salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(payload.password, salt);

    const Data = await prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        password: hashedPassword,
      },
    });

    return res.status(201).json({
      data: Data,
      message: "User Created Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "something went wrong" });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const payload = LoginSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: {
        email: payload.email.toLowerCase(),
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPwValid = await bcrypt.compare(payload.password, user.password);
    if (!isPwValid) {
      return res.status(401).json({ message: "Invalid Password" });
    }

    let jwtPayload = {
      id: user.id,
      email: user.email,
    };

    const token = jwt.sign(jwtPayload, JWT_SECRET!, { expiresIn: "2d" });

    return res.json({
      message: "User LoggedIn Successfully",
      data: {
        ...jwtPayload,
        token: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.log(error)
    return res.status(411).json({ message: "Something went wrong" });
  }
});

export default router;
