import { LikeDislikeDB, PostDB, PostWithCreatorDB } from "../types";
import { BaseDatabase } from "./BaseDatabase";

export class PostDatabase extends BaseDatabase {
    public static TABLE_POSTS = "posts"
    public static TABLE_LIKES_DISLIKES = "likes_dislikes"

    public findPosts = async (): Promise<PostWithCreatorDB[]> => {
        const result: PostWithCreatorDB[] = await BaseDatabase
        .connection(PostDatabase.TABLE_POSTS)
        .select(
            "posts.id",
                "posts.content",
                "posts.likes",
                "posts.dislikes",
                "posts.created_at",
                "posts.updated_at",
                "posts.creator_id",
                "users.nickname AS creator_name"
        )
        .join("users", "posts.creator_id", "=", "users.id")

        return result
    }

    public insertPost = async (postDB: PostDB): Promise<void> => {
        await BaseDatabase
        .connection(PostDatabase.TABLE_POSTS)
        .insert(postDB)
    }

    public findById = async (id: string): Promise<PostDB | undefined> => {
        const result: PostDB[] = await BaseDatabase
        .connection(PostDatabase.TABLE_POSTS)
        .select()
        .where({id})

        return result[0]
    }

    public updatePost = async (idToEdit: string, postDB: PostDB) => {
        await BaseDatabase.connection(PostDatabase.TABLE_POSTS)
        .update(postDB)
        .where({ id: idToEdit })
    }

    public deletePost = async (idToDelete: string) => {
        await BaseDatabase.connection(PostDatabase.TABLE_POSTS)
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
                "posts.created_at",
                "posts.updated_at",
                "posts.creator_id",
                "users.nickname AS creator_name"
        )
        .join("users", "posts.creator_id", "=", "users.id")
        .where("posts.id", postId)

        return result[0]
    }

    public likeOrDislikePost = async (likeDislikeDB: LikeDislikeDB): Promise<void> => {
        await BaseDatabase
        .connection(PostDatabase.TABLE_LIKES_DISLIKES)
        .insert(likeDislikeDB)
    }
}