const Joi = require('joi');

const createOrder = {
    body: Joi.object().keys({
        customer_address: Joi.string().required(),
        phone_number: Joi.string()
            .pattern(/^[0-9]+$/)
            .allow(null, ''),
        products: Joi.array()
            .items(
                Joi.object().keys({
                    product: Joi.string().required(),
                    size: Joi.string().required(),
                    quantity: Joi.string()
                        .pattern(/^[0-9]+$/)
                        .required(),
                })
            )
            .required(),
        note: Joi.string().allow(''),
    }),
};

module.exports = {
    createOrder,
};
