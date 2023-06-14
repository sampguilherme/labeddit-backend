import { LikeDislikePostDB, POST_AND_COMMENT_LIKE, PostDB, PostWithCreatorDB } from "../types";
import { BaseDatabase } from "./BaseDatabase";

export class PostDatabase extends BaseDatabase {
    public static TABLE_POSTS = "posts"
    public static TABLE_LIKES_DISLIKES = "likes_dislikes_posts"

    public findPosts = async (postId: string | undefined): Promise<PostWithCreatorDB[]> => {
        let postDB

        if(postId){
            const result: PostWithCreatorDB[] = await BaseDatabase
                .connection(PostDatabase.TABLE_POSTS)
                .select(
                    "posts.id",
                    "posts.content",
                    "posts.likes",
                    "posts.dislikes",
                    "posts.comments",
                    "posts.created_at",
                    "posts.updated_at",
                    "posts.creator_id",
                    "users.nickname AS creator_name"
                )
                .where({"posts.id": postId})
                .join("users", "posts.creator_id", "=", "users.id")

                postDB = result
        } else {
            const result: PostWithCreatorDB[] = await BaseDatabase
                .connection(PostDatabase.TABLE_POSTS)
                .select(
                    "posts.id",
                    "posts.content",
                    "posts.likes",
                    "posts.dislikes",
                    "posts.comments",
                    "posts.created_at",
                    "posts.updated_at",
                    "posts.creator_id",
                    "users.nickname AS creator_name"
                )
                .join("users", "posts.creator_id", "=", "users.id")

                postDB = result
        }
        

        return postDB
    }

    public insertPost = async (postDB: PostDB): Promise<void> => {
        await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .insert(postDB)
    }

    public findPostById = async (id: string): Promise<PostDB | undefined> => {
        const result: PostDB[] = await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .select()
            .where({id})

        return result[0]
    }

    public updatePost = async (idToEdit: string, postDB: PostDB) => {
        await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .update(postDB)
            .where({ id: idToEdit })
    }

    public deletePost = async (idToDelete: string) => {
        await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .delete()
            .where({ id: idToDelete })
    }

    public findPostWithCreatorById = async (postId: string): Promise<PostWithCreatorDB | undefined> => {
        const result: PostWithCreatorDB[] = await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .select(
                    "posts.id",
                    "posts.content",
                    "posts.likes",
                    "posts.dislikes",
                    "posts.comments",
                    "posts.created_at",
                    "posts.updated_at",
                    "posts.creator_id",
                    "users.nickname AS creator_name"
            )
            .join("users", "posts.creator_id", "=", "users.id")
            .where("posts.id", postId)

        return result[0]
    }

    public likeOrDislikePost = async (likeDislikeDB: LikeDislikePostDB): Promise<void> => {
        await BaseDatabase
            .connection(PostDatabase.TABLE_LIKES_DISLIKES)
            .insert(likeDislikeDB)
    }

    public findLikeDislike = async (likeDislikeDBToFind: LikeDislikePostDB): Promise<POST_AND_COMMENT_LIKE | null> => {
        const [ likeDislikeDB ]: LikeDislikePostDB[] = await BaseDatabase
            .connection(PostDatabase.TABLE_LIKES_DISLIKES)
            .select()
            .where({
                user_id: likeDislikeDBToFind.user_id,
                post_id: likeDislikeDBToFind.post_id
            })
        
        if(likeDislikeDB){
            return likeDislikeDB.like === 1 
                ? POST_AND_COMMENT_LIKE.ALREADY_LIKED 
                : POST_AND_COMMENT_LIKE.ALREADY_DISLIKED
        } else {
            return null
        }
    }

    public removeLikeDislike = async (likeDislikeDB: LikeDislikePostDB): Promise<void> => {
        await BaseDatabase
            .connection(PostDatabase.TABLE_LIKES_DISLIKES)
            .delete()
            .where({
                user_id: likeDislikeDB.user_id,
                post_id: likeDislikeDB.post_id
            })
    }

    public updateLikeDislike = async (likeDislikeDB: LikeDislikePostDB) => {
        await BaseDatabase
            .connection(PostDatabase.TABLE_LIKES_DISLIKES)
            .update(likeDislikeDB)
            .where({
                user_id: likeDislikeDB.user_id,
                post_id: likeDislikeDB.post_id
            })
    }

    
}