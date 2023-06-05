import { CommentDatabase } from "../database/CommentDatabase";
import { PostDatabase } from "../database/PostDataBase";
import { CreateCommentInputDTO, DeleteCommentInputDTO, EditCommentInputDTO, GetCommentsInputDTO, GetCommentsOutputDTO, LikeOrDislikeCommentInputDTO } from "../dtos/commentsDTO";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import { Comment } from "../models/Comment";
import { Post } from "../models/Post";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { CommentWithCreatorDB, LikeDislikeCommentDB, POST_AND_COMMENT_LIKE, PostWithCreatorDB } from "../types";

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

        const postWithCreatorDB = await this.postDatabase.findPostWithCreatorById(idPostToComment)

        if(!postWithCreatorDB){
            throw new NotFoundError("Post não encontrado")
        }

        const post = new Post(
            postWithCreatorDB.id,
            postWithCreatorDB.content,
            postWithCreatorDB.likes,
            postWithCreatorDB.dislikes,
            postWithCreatorDB.comments,
            postWithCreatorDB.created_at,
            postWithCreatorDB.updated_at,
            postWithCreatorDB.creator_id,
            postWithCreatorDB.creator_name
        )

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

        post.addComment()
        const updatedPostDB = post.toDBModel()
        await this.postDatabase.updatePost(idPostToComment, updatedPostDB)
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

    public deleteComment = async (input: DeleteCommentInputDTO): Promise<void> => {
        const { idToDelete, token } = input

        if(!token){
            throw new BadRequestError("'token' esta vazio")
        }

        const payload = this.tokenManager.getPayload(token)

        if(!payload){
            throw new BadRequestError("'token' inválido")
        }

        const commentDB = await this.commentDatabase.findCommentById(idToDelete)

        if(!commentDB){
            throw new NotFoundError("Comentário não encontrado")
        }

        const creatorId = payload.id

        if(commentDB.creator_id !== creatorId){
            throw new BadRequestError("Somente quem criou o comentário pode deleta-lo")
        }

        const postId = commentDB.post_id

        const postWithCreatorDB = await this.postDatabase.findPostWithCreatorById(postId)

        if(!postWithCreatorDB){
            throw new NotFoundError("Post não encontrado")
        }

        const post = new Post(
            postWithCreatorDB.id,
            postWithCreatorDB.content,
            postWithCreatorDB.likes,
            postWithCreatorDB.dislikes,
            postWithCreatorDB.comments,
            postWithCreatorDB.created_at,
            postWithCreatorDB.updated_at,
            postWithCreatorDB.creator_id,
            postWithCreatorDB.creator_name
        )

        await this.commentDatabase.deleteCommentById(idToDelete)

        post.deleteComment()
        const updatedPostDB = post.toDBModel()
        await this.postDatabase.updatePost(postId, updatedPostDB)
    }

    public likeOrDislikeComment = async (input: LikeOrDislikeCommentInputDTO): Promise<void> => {
        const { idToLikeOrDislike, token, like } = input

        if(!token){
            throw new BadRequestError("'token' esta vazio")
        }

        const payload = this.tokenManager.getPayload(token)

        if(!payload){
            throw new BadRequestError("'token' inválido")
        }

        if(typeof like !== "boolean"){
            throw new BadRequestError("'like' deve ser boolean")
        }

        const commentWithCreatorDB = await this.commentDatabase.findCommentWithCreatorById(idToLikeOrDislike)

        if(!commentWithCreatorDB){
            throw new NotFoundError("Comentário não encontrado")
        }

        const userID = payload.id
        const likeSQL = like ? 1 : 0

        const likeDislikeCommentDB: LikeDislikeCommentDB = {
            user_id: userID,
            comment_id: commentWithCreatorDB.id,
            like: likeSQL
        }

        const comment = new Comment(
            commentWithCreatorDB.id,
            commentWithCreatorDB.content,
            commentWithCreatorDB.likes,
            commentWithCreatorDB.dislikes,
            commentWithCreatorDB.created_at,
            commentWithCreatorDB.updated_at,
            commentWithCreatorDB.post_id,
            commentWithCreatorDB.creator_id,
            commentWithCreatorDB.creator_name
        )

        const commentLikeOrDislike = await this.commentDatabase.findLikeDislike(likeDislikeCommentDB)

        if(commentLikeOrDislike === POST_AND_COMMENT_LIKE.ALREADY_LIKED){
            if(like){
                await this.commentDatabase.removeLikeDislike(likeDislikeCommentDB)
                comment.removeLike()
            } else {
                await this.commentDatabase.updateLikeDislike(likeDislikeCommentDB)
                comment.removeLike()
                comment.addDislike()
            }
        } else if(commentLikeOrDislike === POST_AND_COMMENT_LIKE.ALREADY_DISLIKED){
            if(like){
                await this.commentDatabase.updateLikeDislike(likeDislikeCommentDB)
                comment.removeDislike()
                comment.addLike()
            } else {
                await this.commentDatabase.removeLikeDislike(likeDislikeCommentDB)
                comment.removeDislike()
            }
        } else {
            await this.commentDatabase.likeOrDislikeComment(likeDislikeCommentDB)

            if(like){
                comment.addLike()
            } else {
                comment.addDislike()
            }
        }

        const updatedCommentDB = comment.toDBModel()

        await this.commentDatabase.updateComment(idToLikeOrDislike, updatedCommentDB)
    }
}