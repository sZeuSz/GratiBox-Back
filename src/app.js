import express from 'express';
import cors from 'cors';
import signUpUser from './controllers/signUp.js';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/grati-box/sign-up', signUpUser);

export default app;
