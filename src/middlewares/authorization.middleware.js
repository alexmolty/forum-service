import PostService from "../services/post.service.js";
import {HttpError} from "../config/HttpError.js";

class Authorization {
    hasRole(role){
        return(req,res,next) => {
            if(req.principal.roles.includes(role.toUpperCase().trim())) return next()
            else throw new HttpError('Access denied', 403)
        }
    }
    isOwner(paramName) {
        return (req, res, next) => {
            if(req.params[paramName] === req.principal.username) return next()
            else throw new HttpError('Access denied', 403)
        }
    }
    isOwnerOrHasRole(paramName, role) {
        return (req, res, next) => {
            const isOwner = req.params[paramName] === req.principal.username
            const hasRole = req.principal.roles.includes(role.toUpperCase().trim())
            if(isOwner || hasRole) return next()
            else throw new HttpError('Access denied', 403)
        }
    }

    isPostAuthor(postIdParam){
        return async (req,res,next) =>{
            const postId = req.params[postIdParam]
            const post = await PostService.getPostById(postId)
            if(post.author === req.principal.username) return next()
            else throw new HttpError('Access denied', 403)
        }
    }

    isPostAuthorOrHasRole(postIdParam, role){
        return async (req,res,next) =>{
            const postId = req.params[postIdParam]
            const post = await PostService.getPostById(postId)
            const isAuthor = post.author === req.principal.username
            const hasRole = req.principal.roles.includes(role.toUpperCase().trim())
            if(isAuthor || hasRole) return next()
            else throw new HttpError('Access denied', 403)
        }
    }
}
export default new Authorization()