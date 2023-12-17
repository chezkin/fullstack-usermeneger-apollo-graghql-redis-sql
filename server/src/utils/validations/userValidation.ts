import Joi from "joi";
import { UserInterface } from "../../types/UserInterface";


const registerUserValidation = (user: UserInterface) => {
    const schema = Joi.object({
        email: Joi.string()
            .email()
            .required()
            .messages({
                'string.empty': `user "email" cannot be an empty field`,
                'string.email': `user "email" must be a valid email`,
                'any.required': `user "email" is a required field`,
            }),
        password: Joi.string()
            .required()
            //.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=.{7,20}$)/)
            .messages({
                'string.empty': `user "password" cannot be an empty field`,
                'any.required': `user "password" is a required field`,
                //'string.pattern.base': `user "password" must be between 7 and 20 characters, contain at least one numeric digit, one uppercase and one lowercase letter, and one special character`,
            }),
        firstname: Joi.string()
            .required(),
        lastname: Joi.string()
            .required(),
        isadmin: Joi.boolean()
            .required()
    });
    return schema.validate(user)
};

const loginUserValidation = (user: UserInterface) => {
    const schema = Joi.object({
        email: Joi.string()
            .email()
            .required()
            .messages({
                'string.empty': `user "email" cannot be an empty field`,
                'string.email': `user "email" must be a valid email`,
                'any.required': `user "email" is a required field`,
            }),
        password: Joi.string()
            .required()
            //.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=.{7,20}$)/)
            .messages({
                'string.empty': `user "password" cannot be an empty field`,
                'any.required': `user "password" is a required field`,
                //'string.pattern.base': `user "password" must be between 7 and 20 characters, contain at least one numeric digit, one uppercase and one lowercase letter, and one special character`,
            }),
    });
    return schema.validate(user)
};

export { registerUserValidation, loginUserValidation };