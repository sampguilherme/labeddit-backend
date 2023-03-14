import { UserDB } from "../types";
import { BaseDatabase } from "./BaseDatabase";

export class UserDatabase extends BaseDatabase {
    public static TABLE_USERS = "users"

    public async findUsers(q: string | undefined){
        let usersDB

        if(q){
            const result: UserDB[] = await BaseDatabase
            .connection(UserDatabase.TABLE_USERS)
            .where('nickname', 'LIKE', `%${q}%`)

            usersDB = result
        } else {
            const result: UserDB[] = await BaseDatabase
            .connection(UserDatabase.TABLE_USERS)

            usersDB = result
        }

        return usersDB
    }

    public async insertUser(newUseDB: UserDB){
        await BaseDatabase
        .connection(UserDatabase.TABLE_USERS)
        .insert(newUseDB)
    }

    public async findUserByEmail(email: string){
        const [userDB]:UserDB[] | undefined[] = await BaseDatabase
        .connection(UserDatabase.TABLE_USERS)
        .where({ email })
    }
}