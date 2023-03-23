import { PostModel } from "../types"

export interface GetPostsInputDTO {
    token: string | undefined
}

export type GetPostsOutputDTO = PostModel[]