import Joi from 'joi';

const schemas = {
    createPost: Joi.object(
        {
            title: Joi.string().required(),
            content: Joi.string().required(),
            tags: Joi.array().items(Joi.string())
        })
}
const validate = schemaName => (req, res, next) => {
    const schema = schemas[schemaName];
    if (!schema) {
        return next(new Error(`Schema ${schemaName} not found`))
    }
    const {error} = schema.validate(req.body);
    if (error) {
        error.statusCode = 400
        return next(error)
    }
    return next();
}

export default validate