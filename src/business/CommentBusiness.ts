import { CommentDatabase } from "../database/CommentDatabase";
import { PostDatabase } from "../database/PostDataBase";
import { CreateCommentInputDTO, EditCommentInputDTO, GetCommentsInputDTO, GetCommentsOutputDTO } from "../dtos/commentsDTO";
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

        const postToCommentExist = await this.postDatabase.findPostById(idPostToComment)

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

    public editComment = async (input: EditCommentInputDTO): Promise<void> => {
        const { idToEdit, newContent, token} = input

        if(!token){
            throw new BadRequestError("'token' esta vazio")
        }

        const payload = this.tokenManager.getPayload(token)

        if(!payload){
            throw new BadRequestError("'token' inválido")
        }

        if(typeof newContent !== "string"){
            throw new BadRequestError("'content' deve ser string")
        }

        if(newContent.length < 1){
            throw new BadRequestError("Seu post deve conter pelo menos 1 caractere")
        }

        const commentDB = await this.commentDatabase.findCommentById(idToEdit)

        if(!commentDB){
            throw new NotFoundError("Comentário não encontrado")
        }

        const creatorId = payload.id

        if(commentDB.creator_id !== creatorId){
            throw new BadRequestError("Somente quem criou o comentário pode editá-lo")
        }

        const creatorName = payload.nickname

        const comment = new Comment(
            commentDB.id,
            commentDB.content,
            commentDB.likes,
            commentDB.dislikes,
            commentDB.created_at,
            commentDB.updated_at,
            commentDB.post_id,
            creatorId,
            creatorName
        )

        comment.setContent(newContent)
        comment.setUpdatedAt(new Date().toISOString())

        const updatedCommentDB = comment.toDBModel()

        await this.commentDatabase.updateComment(idToEdit, updatedCommentDB)
    }
}