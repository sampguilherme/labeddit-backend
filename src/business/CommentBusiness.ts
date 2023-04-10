import { CommentDatabase } from "../database/CommentDatabase";
import { PostDatabase } from "../database/PostDataBase";
import { GetCommentsInputDTO, GetCommentsOutputDTO } from "../dtos/commentsDTO";
import { BadRequestError } from "../errors/BadRequestError";
import { Comments } from "../models/Comments";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { CommentWithCreatorDB } from "../types";

export class CommentBusiness {
    constructor(
        private commentsDatabase: CommentDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager
    ){}

    public getPostComments = async (input: GetCommentsInputDTO): Promise<GetCommentsOutputDTO> => {
        const { idPostToGetComments, token } = input

        if(!token){
            throw new BadRequestError("'token' esta vazio")
        }

        const payload = this.tokenManager.getPayload(token)

        if(!payload){
            throw new BadRequestError("'token' inválido")
        }

        const commentsWithCreatosDB: CommentWithCreatorDB[] = await this.commentsDatabase.findComments(idPostToGetComments)

        const comments = commentsWithCreatosDB.map((postWithCreatorDB) => {
            const comment = new Comments(
                postWithCreatorDB.id,
                postWithCreatorDB.content,
                postWithCreatorDB.likes,
                postWithCreatorDB.dislikes,
                postWithCreatorDB.created_at,
                postWithCreatorDB.updated_at,
                postWithCreatorDB.post_id,
                postWithCreatorDB.creator_id,
                postWithCreatorDB.creator_name
            )

            return comment.toBusinessModel()
        })

        const output: GetCommentsOutputDTO = comments

        return output
    }
}