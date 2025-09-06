import express, { json, Request } from "express";
import WebSocket from "ws";
import { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend_common/config";
import {prisma} from '@repo/db/client'

const app = express();

const httpserver = app.listen(3001);

const wss = new WebSocketServer({ server: httpserver });

interface User{
    ws: WebSocket,
    rooms: string[]
    userId: string
}

const users:User[] = []

function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET!);

    if (typeof decoded == "string") {
      return null;
    }

    if (!decoded || !decoded.id) {
      return null;
    }

    return decoded.id;
  } catch (e) {
    console.log(e)
    return null;
  }
 
}

wss.on("connection", (ws, request) => {
  const url = request.url;
  if (!url) {
    return;
  }

  const queryParam = new URLSearchParams(url.split("?")[1]);
  const token = queryParam.get("token") || "";
  const userId = checkUser(token)

  if(!userId){
    ws.close()
    return null
  }

  users.push({
    userId,
    rooms:[],
    ws
  })

  ws.on("message", async function message(data:any) {
    let parsedData
    if(typeof data !== "string"){
        parsedData = JSON.parse(data.toString())
    }
    else{
        parsedData = JSON.parse(data)
    }

    if(parsedData.type === 'join_room'){
        const user = users.find(x => x.ws == ws)
        user?.rooms.push(parsedData.roomId.toString())
    }
    console.log(users)

    if(parsedData.type === 'leave_room'){
        const user = users.find(x => x.ws === ws)
        if(!user){
            return
        }
        user.rooms = user?.rooms.filter(x => x === parsedData.room)
    }

    if(parsedData.type === 'chat'){
        const roomId = parsedData.roomId.toString()
        const message = parsedData.message
        
        await prisma.chat.create({
            data:{
                roomId : Number(roomId),
                message,
                userId
            }
        })

        users.forEach(user =>{
            if(user.rooms.includes(roomId)){
                user.ws.send(JSON.stringify({
                    type: "chat",
                    message:message,
                    roomId
                }))
                console.log(message)
            }
        })
    }
  });
//   ws.send("Hello im server");
});
