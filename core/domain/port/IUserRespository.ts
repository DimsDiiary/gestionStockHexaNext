import { Users } from "../entities/User";

export interface IUserRepository {
    findByEmail(email: string) : Promise <Users | null >
    create(user : Omit<Users, 'id'>) : Promise<Users>
    findMany() : Promise<Users[]>
    update(id: string, user: Partial<Users>) : Promise<Users>
    delete(id: string) : Promise<void>
}