import { UserDatabase } from "../database/UserDatabase";
import { GetUsersInputDTO, GetUsersOutputDTO, LoginInputDTO, LoginOutputDTO, SignupInputDTO, SignupOutput } from "../dtos/userDTO";
import { BadRequestError } from "../errors/BadRequestError";
import { User } from "../models/User";
import { IdGenerator } from "../services/IdGenerator";
import { HashManager } from "../services/HashManager";
import { TokenManager, TokenPayload } from "../services/TokenManager";
import { NotFoundError } from "../errors/NotFoundError";


export class UserBusiness {
    constructor(
        private userDatabase: UserDatabase,
        private idGenerator: IdGenerator,
        private hashManager: HashManager,
        private tokenManager: TokenManager
    ){}
    public getUsers = async (input: GetUsersInputDTO): Promise<GetUsersOutputDTO> => {
        const { q } = input

        if(typeof q !== "string" && q !== undefined){
            throw new BadRequestError("'q' deve ser string ou undefined")
        }
        
        const usersDB = await this.userDatabase.findUsers(q)

        const users = usersDB.map((userDB) => {
            const user = new User(
                userDB.id,
                userDB.nickname,
                userDB.password,
                userDB.email,
                userDB.created_at
            )

            return user.toBusinessModel()
        })

        const output: GetUsersOutputDTO = users

        return output
    }

    public signup = async (input: SignupInputDTO): Promise<SignupOutput> => {
        const { nickname, email, password } = input

        const emailRegex = /\S+@\S+\.\S+/
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/

        if(typeof nickname !== "string"){
            throw new BadRequestError("'nickname' deve ser string")
        }

        if(typeof email !== "string"){
            throw new BadRequestError("'email' deve ser string")
        }

        if(typeof password !== "string"){
            throw new BadRequestError("'password' deve ser string")
        }

        if(nickname.length < 1 || email.length < 1 || password.length < 1){
            throw new BadRequestError("Preencha os campos vazios.")
        }

        if(nickname.length < 2){
            throw new BadRequestError("Seu apelido deve conter 2 ou mais caracteres.")
        }

        if(!email.match(emailRegex)){
            throw new BadRequestError("E-mail inválido.")
        }

        const emailExist = await this.userDatabase.findUserByEmail(email)
        if(emailExist){
            throw new BadRequestError("E-mail já cadrastado.")
        }

        if(!password.match(passwordRegex)){
            throw new BadRequestError("Sua senha deve conter no mínimo oito caracteres, pelo menos uma letra e um número.")
        }


        const id = this.idGenerator.generate()

        const hashPassword = await this.hashManager.hash(password)

        const newUser = new User(
            id,
            nickname,
            hashPassword,
            email,
            new Date().toISOString()
        )

        const newUserDB = newUser.toDBModel()
        await this.userDatabase.insertUser(newUserDB)

        const tokenPayload: TokenPayload = {
            id: newUser.getId(),
            nickname: newUser.getNickname()
        }

        const token = this.tokenManager.createToken(tokenPayload)

        const output: SignupOutput = {
            message: "Cadastro realizado com sucesso.",
            token
        }

        return output
    }

    public login = async (input: LoginInputDTO): Promise<LoginOutputDTO> => {
        const { email, password } = input

        if(email.length < 1 || password.length < 1){
            throw new BadRequestError("Preencha os campos em branco.")
        }

        const userDB = await this.userDatabase.findUserByEmail(email)

        if(!userDB){
            throw new NotFoundError("E-mail não cadastrado.")
        }

        const user = new User(
            userDB.id,
            userDB.nickname,
            userDB.password,
            userDB.email,
            userDB.created_at
        )

        const isPassWordCorrect = await this.hashManager.compare(password, user.getPassword())

        if(!isPassWordCorrect){
            throw new BadRequestError("E-mail ou senha incorretos.")
        }

        const payload: TokenPayload =   {
            id: user.getId(),
            nickname: user.getNickname()
        }

        const token = this.tokenManager.createToken(payload)

        const output: LoginOutputDTO = {
            message: "Login realizado com sucesso.",
            token
        }

        return output
    }
}