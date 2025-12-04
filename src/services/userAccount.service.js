import userAccountRepository from "../repositories/userAccount.repository.js";

function ThrowErrorUserNotFound(login) {
    const error = new Error(`User with login "${login}" not found`)
    error.statusCode = 404
    throw error
}

class UserAccountService {
    async register(user) {
        const userExists = await userAccountRepository.getUser(user.login)
        if (userExists) {
            const error = new Error(`User with login "${user.login}" already exists`)
            error.statusCode = 409
            throw error
        }
        return await userAccountRepository.register(user)
    }

    async getUser(login) {
        const userExists = await userAccountRepository.getUser(login)
        if (!userExists) ThrowErrorUserNotFound(login)
        return userExists
    }

    async deleteUser(login) {
        const userDeleted = await userAccountRepository.deleteUser(login)
        if (!userDeleted) ThrowErrorUserNotFound(login)
        return userDeleted
    }

    async updateUser(login, data) {
        const userUpdated = await userAccountRepository.updateUser(login, data)
        if (!userUpdated) ThrowErrorUserNotFound(login)
        return userUpdated
    }

    async changeRole(login, role, isAddRole) {
        role = role.toUpperCase()
        let userUpdated
        if (isAddRole) userUpdated = await userAccountRepository.addRole(login, role)
        else userUpdated = await userAccountRepository.deleteRole(login, role)
        if (!userUpdated) ThrowErrorUserNotFound(login)
        userUpdated.firstName = userUpdated.lastName = undefined
        return userUpdated
    }

    async changePassword(login, newPassword) {
        const userUpdated = await userAccountRepository.changePassword(login, newPassword)
        if(!userUpdated) ThrowErrorUserNotFound(login)
        return userUpdated
    }
}

export default new UserAccountService()