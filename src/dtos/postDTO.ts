import { PostModel } from "../types"

export interface GetPostsInputDTO {
    token: string | undefined
}

export type GetPostsOutputDTO = PostModel[]

export interface CreatePostInputDTO {
    token: string | undefined,
    content: unknown
}

export interface EditPostInputDTO {
    idToEdit: string,
    newContent: unknown,
    token: string | undefined
}

export interface DeletePostInputDTO {
    idToDelete: string,
    token: string | undefined
}

export interface LikeOrDislikePostInputDTO {
    idToLikeOrDislike: string,
    token: string | undefined,
    like: unknown
}