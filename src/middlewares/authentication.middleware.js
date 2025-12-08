import User from "../models/user.js";
import {HttpError} from "../config/HttpError.js";

const authentication = async (req, res, next) => {
    if(req.path !== '/account/register' && !(req.path.startsWith('/forum/posts'))) {
        const authorization = req.headers.authorization
        if (!authorization || !authorization.startsWith('Basic ')) {
            throw new HttpError('Invalid credentials', 401)
        }
        const token = authorization.split(' ')[1]
        const decodedToken = Buffer.from(token, 'base64').toString('ascii')
        const [login, password] = decodedToken.split(':')
        const userAccount = await User.findById(login)
        if(!userAccount || !(await userAccount.comparePassword(password))) {
            throw new HttpError('Invalid credentials', 401)
        }
        req.headers.authorization = '';
        req.principal = {username: login, roles: userAccount.roles}
    }

    return next()
}
export default authentication