/* eslint-disable import/prefer-default-export */
import joi from 'joi';

const plansSignSchema = joi.object({
    name: joi.string().required(),
    address: joi.string().required(),
    cep: joi.string().regex(/[0-9]{5}-[0-9]{3}/).required(),
    city: joi.string().required(),
    state: joi.string().required(),
    type: joi.string().valid('Monthly', 'Weekly').required(),
    day: joi.string().valid('Dia 01', 'Dia 10', 'Dia 20', 'Monday', 'Wednesday', 'Friday').required(),
    items: joi.array().items(joi.string().valid('Chás', 'Incensos', 'Produtos organicos')).required(),
});

export {
    plansSignSchema,
};
