import { PostDatabase } from "../database/PostDataBase";
import { CreatePostInputDTO, DeletePostInputDTO, EditPostInputDTO, GetPostsInputDTO, GetPostsOutputDTO, LikeOrDislikePostInputDTO } from "../dtos/postDTO";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import { Post } from "../models/Post";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { LikeDislikeDB, POST_LIKE, PostDB, PostWithCreatorDB } from "../types";

export class PostBusiness{
    constructor(
        private postDatabase: PostDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager
    ){}

    public getPosts = async (input: GetPostsInputDTO): Promise<GetPostsOutputDTO> => {
        const {token} = input

        if(!token){
            throw new BadRequestError("'token' esta vazio")
        }

        const payload = this.tokenManager.getPayload(token)

        if(!payload){
            throw new BadRequestError("'token' inválido")
        }

        const postsWithCreatosDB: PostWithCreatorDB[] = await this.postDatabase.findPosts()
        
        const posts = postsWithCreatosDB.map((postWithCreatorDB) => {
            const post = new Post(
                postWithCreatorDB.id,
                postWithCreatorDB.content,
                postWithCreatorDB.likes,
                postWithCreatorDB.dislikes,
                postWithCreatorDB.created_at,
                postWithCreatorDB.updated_at,
                postWithCreatorDB.creator_id,
                postWithCreatorDB.creator_name
            )

            return post.toBusinessModel()
        })

        const output: GetPostsOutputDTO = posts

        return output
    }

    public createPost = async (input: CreatePostInputDTO): Promise<void> => {
        const {token, content} = input

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

        const id = this.idGenerator.generate()
        const createdAt = new Date().toISOString()
        const updatedAt = new Date().toISOString()
        const creatorId = payload.id
        const creatorName = payload.nickname

        const post = new Post(
            id,
            content,
            0,
            0,
            createdAt,
            updatedAt,
            creatorId,
            creatorName
        )

        const postDB = post.toDBModel()

        await this.postDatabase.insertPost(postDB)
    }

    public editPost = async (input: EditPostInputDTO): Promise<void> => {
        const {idToEdit, newContent, token} = input

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

        const postDB = await this.postDatabase.findPostById(idToEdit)

        if(!postDB){
            throw new NotFoundError("Post não encontrado")
        }

        const creatorId = payload.id

        if(postDB.creator_id !== creatorId){
            throw new BadRequestError("Somente quem criou o post pode editá-lo")
        }

        const creatorName = payload.nickname

        const post = new Post(
            postDB.id,
            postDB.content,
            postDB.likes,
            postDB.dislikes,
            postDB.created_at,
            postDB.updated_at,
            creatorId,
            creatorName
        )

        post.setContent(newContent)
        post.setUpdatedAt(new Date().toISOString())

        const updatedPostDB = post.toDBModel()

        await this.postDatabase.updatePost(idToEdit, updatedPostDB)
    }

    public deletePost = async (input: DeletePostInputDTO): Promise<void> => {
        const {idToDelete, token} = input

        if(!token){
            throw new BadRequestError("'token' esta vazio")
        }

        const payload = this.tokenManager.getPayload(token)

        if(!payload){
            throw new BadRequestError("'token' inválido")
        }


        const postDB = await this.postDatabase.findPostById(idToDelete)

        if(!postDB){
            throw new NotFoundError("Post não encontrado")
        }

        const creatorId = payload.id

        if(postDB.creator_id !== creatorId){
            throw new BadRequestError("Somente quem criou o post pode deleta-lo")
        }

        await this.postDatabase.deletePost(idToDelete)
    }

    public likeOrDislikePost = async (input: LikeOrDislikePostInputDTO): Promise<void> => {
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

        const postWithCreatorDB = await this.postDatabase.findPostWithCreatorById(idToLikeOrDislike)

        if(!postWithCreatorDB){
            throw new NotFoundError("Post não encontrado")
        }

        const userId = payload.id
        const likeSQLite = like ? 1 : 0

        const likeDislikeDB:  LikeDislikeDB = {
            user_id: userId,
            post_id: postWithCreatorDB.id,
            like: likeSQLite
        }

        const post = new Post(
            postWithCreatorDB.id,
            postWithCreatorDB.content,
            postWithCreatorDB.likes,
            postWithCreatorDB.dislikes,
            postWithCreatorDB.created_at,
            postWithCreatorDB.updated_at,
            postWithCreatorDB.creator_id,
            postWithCreatorDB.creator_name
        )

        const postLikeOrDislike = await this.postDatabase.findLikeDislike(likeDislikeDB)

        if (postLikeOrDislike === POST_LIKE.ALREADY_LIKED){
            if(like) {
                await this.postDatabase.removeLikeDislike(likeDislikeDB)
                post.removeLike()
            } else {
                await this.postDatabase.updateLikeDislike(likeDislikeDB)
                post.removeLike()
                post.addDislike()
            }
        } else if (postLikeOrDislike === POST_LIKE.ALREADY_DISLIKED) {
            if(like) {
                await this.postDatabase.updateLikeDislike(likeDislikeDB)
                post.removeDislike()
                post.addLike()
            } else {
                await this.postDatabase.removeLikeDislike(likeDislikeDB)
                post.removeDislike()
            }
        } else {
            await this.postDatabase.likeOrDislikePost(likeDislikeDB)

            if(like){
                post.addLike()
            } else {
                post.addDislike()
            }
        }

        const updatedPostDB = post.toDBModel()

        await this.postDatabase.updatePost(idToLikeOrDislike, updatedPostDB)

    }
}