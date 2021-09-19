import validator from 'express-validator';

const {checkSchema} = validator;

const signup = checkSchema({
    name: {
        trim: true,
        isLength: {
            options: { min: 2 }
        },
        errorMessage: 'Nome precisa ter no mínimo 2 caracteres'
    },
    email: {
        isEmail: true,
        normalizeEmail: true,
        errorMessage: 'E-mail inválido'
    },
    password: {
        isLength: {
            options: { min: 2 }
        },
        errorMessage: 'Senha precisa ter no nínimo 2 caracteres'
    },
    state: {
        notEmpty: true,
        errorMessage: 'Estado não foi preenchido'
    }
});

const signin = checkSchema({
    email: {
        isEmail: true,
        normalizeEmail: true,
        errorMessage: 'E-mail inválido'
    },
    password: {
        isLength: {
            options: {min: 2}
        },
        errorMessage: 'Senha precisa ter no mínimo 2 caracteres'
    }
});

export default {signup, signin}