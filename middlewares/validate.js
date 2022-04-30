const Joi = require('joi');
const pick = require('../common/pick');
const ErrorResponse = require('../common/ErrorResponse');

const validate = (schema) => (req, res, next) => {
    const validSchema = pick(schema, ['params', 'query', 'body']);

    const object = pick(req, Object.keys(validSchema));

    const { value, error } = Joi.compile(validSchema)
        .prefs({ errors: { label: 'key' }, abortEarly: false })
        .validate(object);

    if (error) {
        const errorMessage = error.details
            .map((details) => details.message)
            .join(', ');
        return next(new ErrorResponse(errorMessage, 400));
    }
    Object.assign(req, value);
    return next();
};

module.exports = validate;
