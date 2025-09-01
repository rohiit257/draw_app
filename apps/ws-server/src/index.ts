import express, { Request } from 'express'
import WebSocket from 'ws'
import { WebSocketServer } from 'ws'
import jwt, { JwtPayload } from 'jsonwebtoken'

const app = express()

const httpserver =  app.listen(3001)

const wss = new WebSocketServer({server:httpserver})

wss.on('connection',(ws,req:Request)=>{
    const url = req.url
    if(!url){return}

    const queryParam = new URLSearchParams(url.split('?')[1])
    const token = queryParam.get('token') || ""

    const decoded  = jwt.verify(token,process.env.SECRET_KEY!)

    if(!decoded ||!(decoded as JwtPayload).userId){
        ws.close()
        return
    }
    ws.on('message',function message(data){
        ws.send('pong')
        console.log(data)
    })
    ws.send("Hello im server")
})