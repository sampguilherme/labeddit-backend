export class Comments {
    constructor(
        private id: string,
        private content: string,
        private likes: number,
        private dislikes: number,
        private createdAt: string,
        private updatedAt: string,
        private postId: string,
        private creatorId: string,
        private creatorName: string
    ){}
}