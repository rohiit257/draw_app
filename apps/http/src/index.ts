import express, { response } from 'express'

const app = express()

app.listen(3000,()=>{
    console.log("Server Running On PORT 3000 🚀")
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

