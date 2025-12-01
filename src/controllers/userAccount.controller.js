import userAccountService from "../services/userAccount.service.js";

class UserAccountController {
    async register(req, res, next) {
        try {
            const user = await userAccountService.register(req.body);
            return res.json(user);
        } catch (error) {
            return next(error)
        }
    }

    async deleteUser(req, res, next) {
        try {
            const user = await userAccountService.deleteUser(req.params.login);
            return res.json(user);
        } catch (error) {
            return next(error)
        }
    }
    async updateUser(req, res, next) {
        try {
            const user = await userAccountService.updateUser(req.params.login, req.body);
            return res.json(user);
        } catch (error) {
            return next(error)
        }
    }
    async addRole(req, res, next) {
        try {
            const user = await userAccountService.addRole(req.params.login, req.params.role);
            return res.json(user);
        } catch (error) {
            return next(error)
        }
    }

    async deleteRole(req, res, next) {
        try {
            const user = await userAccountService.deleteRole(req.params.login, req.params.role);
            return res.json(user);
        } catch (error) {
            return next(error)
        }
    }

    async getUser(req, res, next) {
        try {
            const user = await userAccountService.getUser(req.params.login);
            return res.json(user);
        } catch (error) {
            return next(error)
        }
    }
    async login(req, res, next) {
        // TODO (next lesson)
    }

    async changePassword(req, res, next) {
        // TODO (next lesson)
    }
}
export default new UserAccountController()