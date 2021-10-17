import validator, { query } from 'express-validator';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const { validationResult, matchedData } = validator;

import State from '../models/State.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Ad from '../models/Ad.js';

const getStates = async (req, res) => {
    const states = await State.find();
    res.json({ states });
}

const getStateByName = async (req, res) => {
    const stateName =  (req.query.state).toUpperCase() ;
    const state = await State.findOne({name: stateName});
    res.json(state.id);
}

const info = async (req, res) => {
    const { token } = req.query; //ou const token = req.query.token;

    const user = await User.findOne({ token });
    const state = await State.findById(user.state);
    const ads = await Ad.find({ idUser: user._id.toString() });

    let adList = [];
    for (let i in ads) {
        const cat = await Category.findById(ads[i].category);

        // adList.push({
        //     id: ads[i]._id,
        //     status: ads[i].status,
        //     images: ads[i].images,
        //     dateCreated: ads[i].dateCreated,
        //     title: ads[i].title,
        //     price: ads[i].price,
        //     priceNegotiable: ads[i].priceNegotiable,
        //     description: ads[i].description,
        //     views: ads[i].views,
        //     category: cat.slug
        // })

        adList.push({ ...ads[i], category: cat.slug });
    }

    res.json({
        name: user.name,
        email: user.email,
        state: state.name,
        ads: adList
    });
}

const editAction = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ error: errors.mapped() });
    }
    const data = matchedData(req);

    let updates = {};

    if (data.name) {
        updates.name = data.name;
    }

    if (data.email) {
        const emailCheck = await User.findOne({ email: data.email });
        if (emailCheck && emailCheck.email !== data.email) {
            return res.json({ error: 'E-mail já existe' });
        }
        updates.email = data.email;
    }

    if (data.state) {
        if (mongoose.Types.ObjectId.isValid(data.state)) {
            const stateCheck = await State.findById(data.state);
            if (!stateCheck) {
                return res.json({ error: 'Estado não existe!' });
            }
            updates.state = data.state;
        } else {
            return res.json({error: {state: {msg: 'Estado não existe!'}}});
        }
    }

    if (data.password){
        updates.passwordHash = await bcrypt.hash(data.password, 10);
    }

    await User.findOneAndUpdate({ token: data.token }, { $set: updates });

    res.json({result: 'Usuário alterado com sucesso!'});
}

export default { getStates, getStateByName, info, editAction };