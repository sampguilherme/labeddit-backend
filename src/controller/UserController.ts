
import { Request, Response } from "express";
import { UserBusiness } from "../business/UserBusiness";
import { GetUsersInputDTO, SignupInput } from "../dtos/userDTO";
import { BaseError } from "../errors/BaseError"


export class UserController {
    constructor(
        private userBusiness: UserBusiness
    ) {}

    public getUsers = async (req: Request, res: Response) => {
        try {
            
            const input: GetUsersInputDTO = {
                q: req.query.q
            }

            const output = await this.userBusiness.getUsers(input)

            res.status(200).send(output)

        } catch (error) {
            console.log(error)

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public signup = async (req: Request, res: Response) => {
        try {
            const input: SignupInput = {
                nickname: req.body.nickname,
                email: req.body.email,
                password: req.body.password
            }

            const output = await this.userBusiness.signup(input)

            res.status(201).send(output)
        } catch (error) {
            console.log(error)

            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }
}