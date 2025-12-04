import User from "../models/user.js";

class UserAccountRepository {
    async register(user) {
        return User.create(user)
    }

    async getUser(login) {
        return User.findById(login)
    }

    async deleteUser(login) {
        return User.findOneAndDelete({_id: login})
    }

    async updateUser(login, data) {
        return User.findByIdAndUpdate(login, data, {new: true})
    }

    async addRole(login, role) {
        return User.findByIdAndUpdate(login, {$addToSet: {roles: role}}, {new: true})
    }

    async deleteRole(login, role) {
        return User.findByIdAndUpdate(login, {$pull: {roles: role}}, {new: true})
    }

    async changePassword(login, newPassword) {
        const user = await User.findById(login)
        if (!user) return null
        user.password = newPassword
        return await user.save()
    }
}

export default new UserAccountRepository()