import validator from 'express-validator';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const { validationResult, matchedData } = validator;

import User from '../models/User.js';
import State from '../models/State.js';

const signIn = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({error: errors.mapped() });
    }

    const data = matchedData(req);

    //Validando o e-mail
    const user = await User.findOne({email: data.email});
    if (!user){
        return res.json({error: 'E-mail e/ou senha não encontrado'});
    }

    //Validando a senha
    const match = await bcrypt.compare(data.password, user.passwordHash);
    if (!match){
        return res.json({error: 'E-mail e/ou senha não encontrado'});
    }

    //Gera o token
    const payload = (Date.now() + Math.random()).toString();
    const token = await bcrypt.hash(payload, 10);
    user.token = token;

    //Salva usuário no banco
    await user.save();

    res.json({token, email: data.email});
}

const signUp = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ error: errors.mapped() });
    }

    const data = matchedData(req);

    //Verificando se e-mail já existe
    const user = await User.findOne({ email: data.email });
    if (user) {
        return res.json({ error: { email: { msg: 'E-mail já existe!' } } });
    }

    //Verificando se o estado existe
    if (mongoose.Types.ObjectId.isValid(data.state)) {
        const stateItem = await State.findById(data.state);
        if (!stateItem) {
            return res.json({ error: { state: { msg: 'Estado não existe!' } } });
        }
    } else {
        return res.json({error: {state: {msg: 'Código de estado inválido!'}}});
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const payload = (Date.now() + Math.random()).toString();
    const token = await bcrypt.hash(payload, 10);

    const newUser = new User({
        name: data.name,
        email: data.email,
        passwordHash,
        token,
        state: data.state
    });
    await newUser.save();

    res.json({token});

    res.json({ allRight: true, data });
}

export default { signIn, signUp };
