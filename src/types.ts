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