import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { userRouter } from "./router/userRouter"
import { postRouter } from './router/postRouter'
import { commentRouter } from './router/commentRouter'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.listen(process.env.PORT, () => {
    console.log(`Servidor rodando na porta ${Number(process.env.PORT)}`)
})

app.use('/users', userRouter)

app.use('/posts', postRouter)

app.use('/comments', commentRouter)