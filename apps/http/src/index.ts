import express, { response } from 'express'

const app = express()

app.listen(3000,()=>{
    console.log("Server Running On PORT 3000 🚀")
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));





import authRoutes from './routes/authRoute.js'
import roomRoute from './routes/roomRoute.js'

app.use('/auth',authRoutes)
app.use('/room',roomRoute)