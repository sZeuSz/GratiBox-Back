import bcrypt from 'bcrypt';
import connection from '../database.js';
import { signUpSchema } from '../schemas/users.js';

export default async function signUpUser(req, res) {
    const {
        name,
        email,
        password,
    } = req.body;

    const { error } = signUpSchema.validate(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    try {
        const existEmail = await connection.query('SELECT * FROM users WHERE email = $1', [email]);

        if (existEmail.rowCount) {
            return res.status(409).send('Email in use');
        }

        const passwordEncryted = bcrypt.hashSync(password, 12);

        await connection.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', [name, email, passwordEncryted]);

        return res.status(201).send('created');
    } catch (erro) {
        return res.sendStatus(500);
    }
}
