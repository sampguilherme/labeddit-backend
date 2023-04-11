import { CommentDB, CommentWithCreatorDB } from "../types";
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

    public insertComment = async (commentDB: CommentDB): Promise<void> => {
        await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENTS)
            .insert(commentDB)
    }

    public findCommentById = async (id: string): Promise<CommentDB | undefined> => {
        const result: CommentDB[] = await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENTS)
            .select()
            .where({id})
        
        return result[0]
    }

    public updateComment = async (idToEdit: string, commentDB: CommentDB): Promise<void> => {
        await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENTS)
            .update(commentDB)
            .where({id: idToEdit})
    }
}