import express from 'express';

import AuthController from './controllers/AuthController.js';
import UserController from './controllers/UserController.js';
import AdsController from './controllers/AdsController.js';

import Auth from './middlewares/Auth.js';

import AuthValidator from './validators/AuthValidator.js';
import UserValidator from './validators/UserValidator.js';

const router = express.Router();

router.get('/ping', (req,res)=>{
    res.json({pong: true});
});

router.get('/states', UserController.getStates);

router.post('/user/signin', AuthValidator.signin, AuthController.signIn);
router.post('/user/signup', AuthValidator.signup, AuthController.signUp);

router.get('/user/me', Auth.privateRoute, UserController.info);
router.put('/user/me', UserValidator.editAction, Auth.privateRoute, UserController.editAction);

router.get('/categories', AdsController.getCategories);

router.post('/ad/add', Auth.privateRoute, AdsController.addAction);
router.get('/ad/list', AdsController.getList);
router.get('/ad/item', AdsController.getItem);
router.post('/ad/:id', Auth.privateRoute, AdsController.editAction);

export default router;