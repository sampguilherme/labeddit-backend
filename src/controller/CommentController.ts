import { Request, Response } from "express";
import { CommentBusiness } from "../business/CommentBusiness";
import { BaseError } from "../errors/BaseError";
import { GetCommentsInputDTO } from "../dtos/commentsDTO";

export class CommentController{
    constructor(
        private commentsBusiness: CommentBusiness
    ){}

    public getPostComments = async (req: Request, res: Response) => {
        try {
            const input: GetCommentsInputDTO = {
                idPostToGetComments: req.params.id,
                token: req.headers.authorization
            }

            const output = await this.commentsBusiness.getPostComments(input)

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
}