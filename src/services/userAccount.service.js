import PostService from "./post.service.js";
import userAccountRepository from "../repositories/userAccount.repository.js";

function ThrowErrorUserNotFound(login){
    const error = new Error(`User with login "${login}" not found`)
    error.statusCode = 404
    throw error
}
class UserAccountService {
    async register(user) {
        const userExists = await userAccountRepository.getUser(user.login)
        if(userExists) {
            const error = new Error(`User with login ${user.login} already exists`)
            error.statusCode = 409
            throw error
        }
        const {login, ...rest} = user
        const doc = {
            _id: login,
            ...rest
        }
        return await userAccountRepository.register(doc)
    }

    async getUser(login) {
        const userExists = await userAccountRepository.getUser(login)
        if(!userExists) ThrowErrorUserNotFound(login)
        return userExists
    }

    async deleteUser(login) {
        const userDeleted = await userAccountRepository.deleteUser(login)
        if(!userDeleted) ThrowErrorUserNotFound(login)
        return userDeleted
    }

    async updateUser(login, data) {
        const userUpdated = await userAccountRepository.updateUser(login, data)
        if(!userUpdated) ThrowErrorUserNotFound(login)
        return userUpdated
    }

    async addRole(login, role) {
        const roleUpperCase = role.toUpperCase()
        const userUpdated = await userAccountRepository.addRole(login, roleUpperCase)
        if(!userUpdated) ThrowErrorUserNotFound(login)
        return userUpdated
    }

    async deleteRole(login, role) {
        const roleUpperCase = role.toUpperCase()
        const userUpdated = await userAccountRepository.deleteRole(login, roleUpperCase)
        if(!userUpdated) ThrowErrorUserNotFound(login)
        return userUpdated
    }

    async changePassword(login, newPassword) {
        // TODO (next lesson)
    }
    async login(login, password) {
        // TODO (next lesson)
    }

}
export default new UserAccountService()