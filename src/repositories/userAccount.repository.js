import User from "../models/user.js";

class UserAccountRepository {
    register(user) {
        return User.create(user)
    }

    getUser(login) {
        return User.findById(login)
    }

    deleteUser(login) {
        return User.findOneAndDelete({_id: login})
    }

    updateUser(login, data) {
        return User.findByIdAndUpdate(login, data, {new: true})
    }

    addRole(login, role) {
        return User.findByIdAndUpdate(login, {$addToSet: {roles: role}}, {new: true})
    }

    deleteRole(login, role) {
        return User.findByIdAndUpdate(login, {$pull: {roles: role}}, {new: true})
    }

    login(login, password) {
        // TODO (next lesson)
    }

    changePassword(login, newPassword) {
        // TODO (next lesson)
    }
}

export default new UserAccountRepository()