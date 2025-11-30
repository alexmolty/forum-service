import Joi from 'joi';

const schemas = {
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
    ),
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
    )
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