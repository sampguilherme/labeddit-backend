import { UserModel } from "../types"

export interface GetUsersInputDTO {
    q: unknown
}

export type GetUsersOutputDTO = UserModel[]

export interface LoginInputDTO {
    email: string,
    password: string
}

export interface LoginOutputDTO {
    message: string,
    token: string
}

export interface SignupInput {
    nickname: string,
    email: string,
    password: string
}

export interface SignupOutput {
    message: string,
    token: string
}
