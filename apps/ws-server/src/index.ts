import express from 'express'
import WebSocket from 'ws'
import { WebSocketServer } from 'ws'

const app = express()

const httpserver =  app.listen(3001)

const wss = new WebSocketServer({server:httpserver})

wss.on('connection',(ws)=>{
    ws.send("Hello im server")
})