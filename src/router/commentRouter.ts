import express from 'express'
import { CommentController } from '../controller/CommentController'
import { CommentBusiness } from '../business/CommentBusiness'
import { PostDatabase } from '../database/PostDataBase'
import { IdGenerator } from '../services/IdGenerator'
import { TokenManager } from '../services/TokenManager'
import { CommentDatabase } from '../database/CommentDatabase'

export const commentRouter = express.Router()

const commentController = new CommentController(
    new CommentBusiness(
        new CommentDatabase(),
        new IdGenerator(),
        new TokenManager(),
        new PostDatabase()
    )
)

commentRouter.get('/:id', commentController.getPostComments)

commentRouter.post('/:id', commentController.createComment)