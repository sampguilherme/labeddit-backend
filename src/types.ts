export interface UserDB {
    id: string,
    nickname: string,
    email: string,
    password: string,
    created_at: string
}

export interface UserModel {
    id: string,
    nickname: string,
    password: string,
    email: string,
    createdAt: string
}

export interface PostDB {
    id: string,
    content: string,
    likes: number,
    dislikes: number,
    comments: number,
    created_at: string,
    updated_at: string,
    creator_id: string
}

export interface PostModel {
    id: string,
    content: string,
    likes: number,
    dislikes: number,
    likedOrDisliked: POST_AND_COMMENT_LIKE | null,
    comments: number
    createdAt: string,
    updatedAt: string,
    creator: {
        id: string,
        name: string
    }
}

export interface PostWithCreatorDB extends PostDB {
    creator_name: string
}

export interface LikeDislikePostDB {
    user_id: string,
    post_id: string,
    like: number
}

export enum POST_AND_COMMENT_LIKE {
    ALREADY_LIKED = "ALREADY LIKED",
    ALREADY_DISLIKED = "ALREADY DISLIKED"
}

export interface CommentDB {
    id: string,
    content: string,
    likes: number,
    dislikes: number,
    created_at: string,
    updated_at: string,
    post_id: string,
    creator_id: string
}

export interface CommentModel {
    id: string,
    content: string,
    likes: number,
    dislikes: number,
    createdAt: string,
    updatedAt: string,
    postId: string,
    creator: {
        id: string,
        name: string
    }
}

export interface CommentWithCreatorDB extends CommentDB {
    creator_name: string
}

export interface LikeDislikeCommentDB {
    user_id: string,
    comment_id: string,
    like: number
}