import { CommentModel } from "../types"

export interface GetCommentsInputDTO {
    idPostToGetComments: string,
    token: string | undefined
}

export type GetCommentsOutputDTO = CommentModel[]

export interface CreateCommentInputDTO {
    idPostToComment: string,
    token: string | undefined,
    content: unknown
}

export interface EditCommentInputDTO {
    idToEdit: string,
    newContent: unknown,
    token: string | undefined
}

export interface DeleteCommentInputDTO {
    idToDelete: string,
    token: string | undefined
}

export interface LikeOrDislikeCommentInputDTO {
    idToLikeOrDislike: string,
    token: string | undefined,
    like: unknown
}