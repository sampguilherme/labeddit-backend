import { CommentWithCreatorDB } from "../types";
import { BaseDatabase } from "./BaseDatabase";

export class CommentDatabase extends BaseDatabase{
    public static TABLE_COMMENTS = "comments"
    public static TABLE_LIKES_DISLIKES = "likes_dislikes"

    public findComments = async (idPostToGetComments: string): Promise<CommentWithCreatorDB[]> => {
        const result: CommentWithCreatorDB[] = await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENTS)
            .select(
                "comments.id",
                "comments.content",
                "comments.likes",
                "comments.dislikes",
                "comments.created_at",
                "comments.updated_at",
                "comments.post_id",
                "comments.creator_id",
                "users.nickname AS creator_name"
            )
            .join("users", "comments.creator_id", "=", "users.id")
            .where({post_id: idPostToGetComments})

        return result
    }
}