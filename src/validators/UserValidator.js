import validator from 'express-validator';

const {checkSchema} = validator;

const editAction = checkSchema({
    token: {
        notEmpty: true
    },
    name: {
        optional: true,
        trim: true,
        isLength: {
            options: {min: 2}
        },
        errorMessage: 'Nome precisa ter no mínimo 2 caracteres'
    },
    email: {
        optional: true,
        isEmail: true,
        normalizeEmail: true,
        errorMessage: 'E-mail inválido'
    },
    password: {
        optional: true,
        isLength: {
            options: {min: 2}
        },
        errorMessage: 'Senha precisa ter no mínimo 2 caracteres'
    },
    state: {
        optional: true,
        notEmpty: true,
        errorMessage: 'Estado não foi preenchido'
    }
});

export default {editAction}