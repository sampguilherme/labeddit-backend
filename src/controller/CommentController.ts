import { Request, Response } from "express";
import { CommentBusiness } from "../business/CommentBusiness";
import { BaseError } from "../errors/BaseError";
import { CreateCommentInputDTO, DeleteCommentInputDTO, EditCommentInputDTO, GetCommentsInputDTO, LikeOrDislikeCommentInputDTO } from "../dtos/commentsDTO";

export class CommentController{
    constructor(
        private commentBusiness: CommentBusiness
    ){}

    public getPostComments = async (req: Request, res: Response) => {
        try {
            const input: GetCommentsInputDTO = {
                idPostToGetComments: req.params.id,
                token: req.headers.authorization
            }

            const output = await this.commentBusiness.getPostComments(input)

            res.status(200).send(output)
        } catch (error) {
            console.log(error)

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public createComment = async (req: Request, res: Response) => {
        try {
            const input: CreateCommentInputDTO = {
                idPostToComment: req.params.id,
                token: req.headers.authorization,
                content: req.body.content
            }

            await this.commentBusiness.createComment(input)

            res.status(200).end()
        } catch (error) {
            console.log(error)

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public editComment = async (req: Request, res: Response) => {
        try {
            const input: EditCommentInputDTO = {
                idToEdit: req.params.id,
                token: req.headers.authorization,
                newContent: req.body.content
            }

            await this.commentBusiness.editComment(input)

            res.status(200).end()
        } catch (error) {
            console.log(error) 

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public deleteComment = async (req: Request, res: Response) => {
        try {
            const input: DeleteCommentInputDTO = {
                idToDelete: req.params.id,
                token: req.headers.authorization,
            }

            await this.commentBusiness.deleteComment(input)

            res.status(200).end()
        } catch (error) {
            console.log(error) 

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public likeOrDislikeComment = async (req: Request, res: Response) => {
        try {
            const input: LikeOrDislikeCommentInputDTO = {
                idToLikeOrDislike: req.params.id,
                token: req.headers.authorization,
                like: req.body.like
            }

            await this.commentBusiness.likeOrDislikeComment(input)

            res.status(200).end()
        } catch (error) {
            console.log(error) 

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }
}
