/* eslint-disable no-shadow */
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import connection from '../database.js';
import { signInSchema } from '../schemas/users.js';

export default async function signInUser(req, res) {
    const { email, password } = req.body;

    const { error } = signInSchema.validate(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    try {
        const user = await connection.query(
            'SELECT * FROM users WHERE email = $1;',
            [email],
        );

        const userNotRegistered = user.rowCount === 0;

        const dbPassword = user.rows[0]?.password;

        if (userNotRegistered) {
            return res.status(404).send({ message: 'Usuário ou senha incorretos.' });
        }
        const invalidPassword = !bcrypt.compareSync(password, dbPassword);

        if (invalidPassword) {
            return res.status(400).send({ message: 'Usuário ou senha incorretos.' });
        }
        const Response = {
            name: user.rows[0]?.name,
            email,
            token: jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '3000s' }),
        };

        await connection.query('INSERT INTO sessions (user_id, token) VALUES ($1, $2)', [user.rows[0].id, Response.token]);

        return res.status(200).send(Response);
    } catch (error) {
        return res.status(500).send({ message: 'Ocorreu um erro inesperado, tente novamente' });
    }
}
