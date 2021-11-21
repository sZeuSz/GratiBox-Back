import joi from 'joi';

const signInSchema = joi.object({
    email: joi.string().required(),
    password: joi.string().min(4).required(),
});

const signUpSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().min(4).required(),
    confirmPassword: joi.ref('password'),
});

export {
    signInSchema,
    signUpSchema,
};
