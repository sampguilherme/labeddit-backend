import { CommentDB, CommentModel, POST_AND_COMMENT_LIKE } from "../types"

export class Comment {
    constructor(
        private id: string,
        private content: string,
        private likes: number,
        private dislikes: number,
        private likedOrDisliked: POST_AND_COMMENT_LIKE | null,
        private createdAt: string,
        private updatedAt: string,
        private postId: string,
        private creatorId: string,
        private creatorName: string
    ){}

    public getId(): string {
        return this.id
    }
    public setId(value: string): void {
        this.id = value
    }

    public getContent(): string {
        return this.content
    }
    public setContent(value: string): void {
        this.content = value
    }

    public addLike() {
        this.likes += 1
    }

    public removeLike() {
        this.likes -= 1
    }

    public addDislike() {
        this.dislikes += 1
    }

    public removeDislike() {
        this.dislikes -= 1
    }

    public getDislikes(): number {
        return this.dislikes
    }
    public setDislikes(value: number): void {
        this.dislikes = value
    }

    public getCreatedAt(): string {
        return this.createdAt
    }
    public setCreatedAt(value: string): void {
        this.createdAt = value
    }

    public getUpdatedAt(): string {
        return this.updatedAt
    }
    public setUpdatedAt(value: string): void {
        this.updatedAt = value
    }

    public getPostId(): string {
        return this.postId
    }
    public setPostId(value: string): void {
        this.postId = value
    }


    public getLikedOrDisliked(): POST_AND_COMMENT_LIKE | null {
        return this.likedOrDisliked
    }
    public setLikedOrDisliked(value:POST_AND_COMMENT_LIKE | null ): void  {
        this.likedOrDisliked = value
    }

    
    public getCreatorId(): string {
        return this.creatorId
    }
    public setCreatorId(value: string): void {
        this.creatorId = value
    }

    public getCreatorName(): string {
        return this.creatorName
    }
    public setCreatorName(value: string): void {
        this.creatorName = value
    }

    public toDBModel(): CommentDB {
        return {
            id: this.id,
            content: this.content,
            likes: this.likes,
            dislikes: this.dislikes,
            created_at: this.createdAt,
            updated_at: this.updatedAt,
            post_id: this.postId,
            creator_id: this.creatorId
        }
    }

    public toBusinessModel(): CommentModel {
        return {
            id: this.id,
            content: this.content,
            likes: this.likes,
            dislikes: this.dislikes,
            likedOrDisliked: this.likedOrDisliked,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            postId: this.postId,
            creator: {
                id: this.creatorId,
                name: this.creatorName
            }
        }
    }
}
