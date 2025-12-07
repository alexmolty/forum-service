import User from "../models/user.js";
function ThrowErrorInvalidCredentials() {
    const error = new Error('Invalid credentials')
    error.statusCode = 401
    throw error
}
const authentication = async (req, res, next) => {
    if(req.path !== '/account/register') {
        const authorization = req.headers.authorization
        if (!authorization || !authorization.startsWith('Basic ')) {
            ThrowErrorInvalidCredentials()
        }
        const token = authorization.split(' ')[1]
        const decodedToken = Buffer.from(token, 'base64').toString('ascii')
        const [login, password] = decodedToken.split(':')
        const userAccount = await User.findById(login)
        if(!userAccount || !(await userAccount.comparePassword(password))) {
            ThrowErrorInvalidCredentials()
        }
        req.headers.authorization = '';
        req.principal = {username: login, roles: userAccount.roles}
    }

    return next()
}
export default authentication