import User from '../models/User.js';

const privateRoute = async (req, res, next) => {
    if (!req.query.token && !req.body.token){
        return res.json({notallowed: true});
    };

    let token = '';
    if (req.query.token){
        token = req.query.token;
    };
    if (req.body.token){
        token = req.body.token;
    };

    if (token == ''){
        return res.json({notallowed: true});
    };

    const user = await User.findOne({token});
    if (!user){
        return res.json({notallowed: true});
    }

    next();
}

export default {privateRoute}