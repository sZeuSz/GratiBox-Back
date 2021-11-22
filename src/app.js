import express from 'express';
import cors from 'cors';
import signUpUser from './controllers/signUp.js';
import signInUser from './controllers/signIn.js';
import planSign from './controllers/planSign.js';
import plans from './controllers/plans.js';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/grati-box/sign-up', signUpUser);
app.post('/grati-box/sign-in', signInUser);
app.get('/grati-box/plans', plans);
app.post('/grati-box/planSign', planSign);
export default app;
