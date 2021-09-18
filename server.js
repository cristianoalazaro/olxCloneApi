import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import fileupload from 'express-fileupload';
import path from 'path';

const __dirname = path.resolve();

import routes from './src/routes.js';

dotenv.config();

mongoose.connect(process.env.DATABASE,{
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
});

mongoose.connection.on('error', (error)=>{
    console.log('Erro: ',error.message);
});

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(fileupload());
app.use(express.static(`${__dirname}/public`));
app.use('/',routes);

app.listen(process.env.PORT,()=>{
    console.log(`Rodando no endereço ${process.env.BASE}`);
})
