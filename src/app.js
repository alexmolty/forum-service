import express, {Router} from 'express'
import postRoutes from './routes/post.routes.js'
import userAccountRoutes from "./routes/userAccount.routes.js";
import errorsMiddleware from './middlewares/errors.middleware.js'
import authentication from "./middlewares/authentication.middleware.js";
import authorization from "./middlewares/authorization.middleware.js";
import {ADMIN, MODERATOR} from "./config/constants.js";

const app = express()
const authRouter = Router();

app.use(express.json())
app.use(authentication)

authRouter.all('/account/user/:login/role/:role', authorization.hasRole(ADMIN))
authRouter.patch(['/account/user/:login', '/forum/post/:id/comment/:login'], authorization.isOwner('login'))
// authRouter.patch('/forum/post/:id/comment/:author', authorization.isOwner('author'))
authRouter.delete('/account/user/:login', authorization.isOwnerOrHasRole('login', ADMIN))
authRouter.post('/forum/post/:author', authorization.isOwner('author'))
authRouter.delete('/forum/post/:id', authorization.isPostAuthorOrHasRole('id', MODERATOR))
authRouter.patch('/forum/post/:id', authorization.isPostAuthor('id'))

app.use(authRouter)

app.use('/forum', postRoutes)
app.use('/account', userAccountRoutes)

// Catch-all for unknown routes
app.use((req, res, next) => {
    const err = new Error(`Route ${req.method} ${req.originalUrl} not found`)
    err.statusCode = 404
    next(err)
})

app.use(errorsMiddleware)

export default app
