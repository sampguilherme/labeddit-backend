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

export interface SignupInputDTO {
    nickname: unknown,
    email: unknown,
    password: unknown
}

export interface SignupOutput {
    message: string,
    token: string
}
