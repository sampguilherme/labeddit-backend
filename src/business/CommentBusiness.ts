import { CommentDatabase } from "../database/CommentDatabase";
import { PostDatabase } from "../database/PostDataBase";
import { CreateCommentInputDTO, GetCommentsInputDTO, GetCommentsOutputDTO } from "../dtos/commentsDTO";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import { Comment } from "../models/Comment";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { CommentWithCreatorDB } from "../types";

export class CommentBusiness {
    constructor(
        private commentDatabase: CommentDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
        private postDatabase: PostDatabase
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

        const commentsWithCreatosDB: CommentWithCreatorDB[] = await this.commentDatabase.findComments(idPostToGetComments)

        const comments = commentsWithCreatosDB.map((postWithCreatorDB) => {
            const comment = new Comment(
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

    public createComment = async (input: CreateCommentInputDTO): Promise<void> => {
        const { idPostToComment, token, content } = input

        if(!token){
            throw new BadRequestError("'token' esta vazio")
        }

        const payload = this.tokenManager.getPayload(token)

        if(!payload){
            throw new BadRequestError("'token' inválido")
        }

        if(typeof content !== "string"){
            throw new BadRequestError("'content' deve ser string")
        }

        if(content.length < 1){
            throw new BadRequestError("Seu post deve conter pelo menos 1 caractere")
        }

        const postToCommentExist = await this.postDatabase.findById(idPostToComment)

        if(!postToCommentExist){
            throw new NotFoundError("Post não encontrado")
        }

        const id = this.idGenerator.generate()
        const createdAt = new Date().toISOString()
        const updatedAt = new Date().toISOString()
        const creatorId = payload.id
        const creatorName = payload.nickname

        const comment = new Comment(
            id,
            content,
            0,
            0,
            createdAt,
            updatedAt,
            idPostToComment,
            creatorId,
            creatorName
        )

        const commentDB = comment.toDBModel()

        await this.commentDatabase.insertComment(commentDB)
    }
}