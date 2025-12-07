import Joi from 'joi';
import {ADMIN, MODERATOR, USER} from "../config/constants.js";

const schemas = {
    // POST ACTIONS
    createPost: Joi.object(
        {
            title: Joi.string().required(),
            content: Joi.string().required(),
            tags: Joi.array().items(Joi.string())
        }),
    updatePost: Joi.object(
        {
            title: Joi.string(),
            content: Joi.string(),
            tags: Joi.array().items(Joi.string())
        }
    ).min(1),
    addComment: Joi.object(
        {
            message: Joi.string().required()
        }
    ),
    dateFormat: Joi.object(
        {
            dateFrom: Joi.date().iso(),
            dateTo: Joi.date().iso()
        }
    ).min(1),
    findPostsByTags: Joi.object({
        values: Joi.alternatives().try(
            Joi.array().items(Joi.string()),
            Joi.string()
        ).required()
    }),
    // USER ACTIONS
    register: Joi.object({
        login: Joi.string().required(),
        password: Joi.string().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required()
    }),
    deleteUser: Joi.object({login: Joi.string().required()}),
    updateUser: Joi.object({
        firstName: Joi.string(),
        lastName: Joi.string(),
    }).min(1),
    changeRole: Joi.object({
        login: Joi.string().required(),
        role: Joi.string().valid(USER, ADMIN, MODERATOR).insensitive().required()
    }),
    getUser: Joi.object({login: Joi.string().required()}),
    changePassword: Joi.object({password: Joi.string().required()}),
}
const validate = (schemaName, target = 'body') => (req, res, next) => {
    const schema = schemas[schemaName];
    if (!schema) {
        return next(new Error(`Schema ${schemaName} not found`))
    }
    const {error} = schema.validate(req[target]);
    if (error) {
        error.statusCode = 400
        return next(error)
    }
    return next();
}

export default validate