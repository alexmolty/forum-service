import userAccountRepository from "../repositories/userAccount.repository.js";
import {HttpError} from "../config/HttpError.js";

class UserAccountService {
    async register(user) {
        const userExists = await userAccountRepository.getUser(user.login)
        if (userExists) throw new HttpError(`User ${user.login} already exists`, 409)
        return await userAccountRepository.register(user)
    }

    async getUser(login) {
        const userExists = await userAccountRepository.getUser(login)
        if (!userExists) throw new HttpError(`User with id ${login} not found`, 404)
        return userExists
    }

    async deleteUser(login) {
        const userDeleted = await userAccountRepository.deleteUser(login)
        if (!userDeleted) throw new HttpError(`User with id ${login} not found`, 404)
        return userDeleted
    }

    async updateUser(login, data) {
        const userUpdated = await userAccountRepository.updateUser(login, data)
        if (!userUpdated) throw new HttpError(`User with id ${login} not found`, 404)
        return userUpdated
    }

    async changeRole(login, role, isAddRole) {
        role = role.toUpperCase()
        let userUpdated
        if (isAddRole) userUpdated = await userAccountRepository.addRole(login, role)
        else userUpdated = await userAccountRepository.deleteRole(login, role)
        if (!userUpdated) throw new HttpError(`User with id ${login} not found`, 404)
        userUpdated.firstName = userUpdated.lastName = undefined
        return userUpdated
    }

    async changePassword(login, newPassword) {
        const userUpdated = await userAccountRepository.changePassword(login, newPassword)
        if(!userUpdated) throw new HttpError(`User with id ${login} not found`, 404)
        return userUpdated
    }
}

export default new UserAccountService()