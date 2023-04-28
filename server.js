import express from 'express';
import bcrypt from 'bcrypt';
import cors from 'cors';
import knex from 'knex';
import { handleRegister } from './controllers/register.js';
import { handleSignIn } from './controllers/signin.js';
import { handleImage, handleClarifai } from './controllers/image.js';
import { handleProfile } from './controllers/profile.js';
import { handleDelete } from './controllers/delete.js';


const db = knex({
    client: 'pg',
    connection: {
        host : 'postgres://wu:Uz9pYDHDrBdZsMnHGmgGAgCDPpg2r7ri@dpg-ch5mdid269v5rfrjnhig-a/smartbrain_opk6',
        port : 5432,
        user : 'wu',
        password : 'Uz9pYDHDrBdZsMnHGmgGAgCDPpg2r7ri',
        database : 'smartbrain_opk6'
    }
})

const app = express();
const saltRounds = 10;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => { res.json('success') })

app.post('/signin', (req, res) => { handleSignIn(req, res, db) })

app.post('/register', (req, res) => { handleRegister(req, res, db, saltRounds) })

app.get('/profile/:id', (req, res) => { handleProfile(req, res, db) })

app.put('/image', (req, res) => { handleImage(req, res, db) })

app.post('/imageurl', (req, res) => { handleClarifai(req, res) })

app.delete('/delete', (req, res) => { handleDelete(req, res, db) })


const port = process.env.PORT
app.listen(port || 3000, () => {
    console.log(`app is running on port ${port}`);
})