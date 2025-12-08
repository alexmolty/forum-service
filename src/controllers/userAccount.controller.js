import userAccountService from "../services/userAccount.service.js";
import {HttpError} from "../config/HttpError.js";

class UserAccountController {
    async register(req, res, next) {
        try {
            const user = await userAccountService.register(req.body);
            return res.status(201).json(user);
        } catch (error) {
            return next(error)
        }
    }

    async deleteUser(req, res, next) {
        if(req.principal.username === req.params.login || req.principal.roles.includes('ADMIN')) {
            try {
                const user = await userAccountService.deleteUser(req.params.login);
                return res.json(user);
            } catch (error) {
                return next(error)
            }
        } else {
            throw new HttpError('Only owner or admin can delete this user', 403)
        }
    }
    async updateUser(req, res, next) {
        if(req.principal.username !== req.params.login) {
            throw new HttpError('Not the owner', 403)
        }
        try {
            const user = await userAccountService.updateUser(req.params.login, req.body);
            return res.json(user);
        } catch (error) {
            return next(error)
        }
    }
    async addRole(req, res, next) {
        if(!req.principal.roles.includes('ADMIN')){
            throw new HttpError('Only admin can change roles', 403)
        }
        try {
            const user = await userAccountService.changeRole(req.params.login, req.params.role, true);
            return res.json(user);
        } catch (error) {
            return next(error)
        }
    }

    async deleteRole(req, res, next) {
        if(!req.principal.roles.includes('ADMIN')){
            throw new HttpError('Only admin can change roles', 403)
        }
        try {
            const user = await userAccountService.changeRole(req.params.login, req.params.role, false);
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
        const user = await userAccountService.getUser(req.principal.username);
        return res.json(user);
    }

    async changePassword(req, res, next) {
        await userAccountService.changePassword(req.principal.username, req.body.password)
        return res.sendStatus(204);
    }
}
export default new UserAccountController()