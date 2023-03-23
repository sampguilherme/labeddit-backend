import { Request, Response } from "express";
import { PostBusiness } from "../business/PostBusiness";
import { GetPostsInputDTO } from "../dtos/postDTO";
import { BaseError } from "../errors/BaseError";

export class PostController {
    constructor(
        private postBusiness: PostBusiness
    ){}
    public getPosts = async (req: Request, res: Response) => {
        try {
            const input: GetPostsInputDTO = {
                token: req.headers.authorization
            }

            const output = await this.postBusiness.getPosts(input)

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