import { CommentDB, CommentWithCreatorDB, LikeDislikeCommentDB, POST_AND_COMMENT_LIKE } from "../types";
import { BaseDatabase } from "./BaseDatabase";

export class CommentDatabase extends BaseDatabase{
    public static TABLE_COMMENTS = "comments"
    public static TABLE_LIKES_DISLIKES_COMMENTS = "likes_dislikes_comments"

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

    public deleteCommentById =async (idToDelete: string): Promise<void> => {
        await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENTS)
            .delete()
            .where({id: idToDelete})
    }

    public likeOrDislikeComment = async (likeDislikeCommentDB: LikeDislikeCommentDB): Promise<void> => {
        await BaseDatabase
            .connection(CommentDatabase.TABLE_LIKES_DISLIKES_COMMENTS)
            .insert(likeDislikeCommentDB)
    } 

    public findLikeDislike = async (likeDislikeCommentDBToFind: LikeDislikeCommentDB): Promise<POST_AND_COMMENT_LIKE | null> => {
        const [ likeDislikeCommentDB ]: LikeDislikeCommentDB[] = await BaseDatabase
            .connection(CommentDatabase.TABLE_LIKES_DISLIKES_COMMENTS)
            .select()
            .where({
                user_id: likeDislikeCommentDBToFind.user_id,
                comment_id: likeDislikeCommentDBToFind.comment_id
            })

            if(likeDislikeCommentDB){
                return likeDislikeCommentDB.like === 1
                ? POST_AND_COMMENT_LIKE.ALREADY_LIKED
                : POST_AND_COMMENT_LIKE.ALREADY_DISLIKED
            } else {
                return null
            }
    }

    public removeLikeDislike = async (likeDislikeCommentDB: LikeDislikeCommentDB): Promise<void> => {
        await BaseDatabase
            .connection(CommentDatabase.TABLE_LIKES_DISLIKES_COMMENTS)
            .delete()
            .where({
                user_id: likeDislikeCommentDB.user_id,
                comment_id: likeDislikeCommentDB.comment_id
            })
    }

    public updateLikeDislike = async (likeDislikeCommentDB: LikeDislikeCommentDB) => {
        await BaseDatabase
            .connection(CommentDatabase.TABLE_LIKES_DISLIKES_COMMENTS)
            .update(likeDislikeCommentDB)
            .where({
                user_id: likeDislikeCommentDB.user_id,
                comment_id: likeDislikeCommentDB.comment_id
            })
    }

    public findCommentWithCreatorById = async (commentId: string): Promise<CommentWithCreatorDB | undefined> => {
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
            .where("comments.id", commentId)

        return result[0]
    }
}