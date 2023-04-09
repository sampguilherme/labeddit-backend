import { CommentsBusiness } from "../business/CommentsBusiness";

export class CommentsController{
    constructor(
        private commentsBusiness: CommentsBusiness
    ){}
}