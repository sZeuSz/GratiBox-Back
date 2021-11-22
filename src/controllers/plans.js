/* eslint-disable no-shadow */
import jwt from 'jsonwebtoken';
import connection from '../database.js';

export default async function plans(req, res) {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).send({ message: 'Unauthorized' });
    }

    try {
        const email = jwt.verify(token, process.env.JWT_SECRET);
        const userId = await connection.query(
            'SELECT id FROM users WHERE email = $1;',
            [email.email],
        );
        const user = await connection.query(
            'SELECT * FROM plan WHERE user_id = $1;',
            [userId.rows[0].id],
        );

        if (!user.rows.length) {
            return res.status(400).send([]);
        }
        const result = await connection.query(`
        select
        jsonb_build_object(
            'type', plan.type,
            'day', plan.days,
            'objs', plan.objs,
            'date', plan.date) AS plan,
        jsonb_build_object(
            'name', address.complete_name,
            'address', address.delivery_address,
            'cep', address.cep,
            'city', address.city,
            'state', address.state ) AS address,
        jsonb_build_object('name', users.name, 'email', users.email) AS user
        from plan 
        join address
        on address.plan_id = plan.id
        join users
        on users.id = plan.user_id;`);
        return res.status(200).send(result.rows);
    } catch (error) {
        if (error.message === 'invalid token') {
            return res.status(401).send({ message: 'token is invalid or has been tampered' });
        }
        if (error.message === 'jwt expired') {
            return res.status(401).send({ message: 'token expired' });
        }

        return res.sendStatus(500);
    }
}
