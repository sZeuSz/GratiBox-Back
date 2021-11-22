/* eslint-disable no-shadow */
import jwt from 'jsonwebtoken';
import connection from '../database.js';
import { plansSignSchema } from '../schemas/plans.js';

export default async function planSign(req, res) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const {
        plan,
        address,
    } = req.body;

    const { error } = plansSignSchema.validate({
        name: address.name,
        address: address.address,
        cep: address.cep,
        city: address.city,
        state: address.state,
        type: plan.type,
        day: plan.day,
        items: plan.items,
    });

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    if (!token) {
        return res.status(401).send({ message: 'Unauthorized' });
    }

    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);

        const userId = await connection.query(
            'SELECT id FROM users WHERE email = $1;',
            [data.email],
        );

        const planId = await connection.query('INSERT INTO plan (type, days, date, objs, user_id) VALUES ($1, $2 , NOW() , $3, $4) RETURNING id;', [plan.type, plan.day, plan.items, userId.rows[0].id]);

        await connection.query('INSERT INTO address (complete_name, delivery_address, cep, city, state, plan_id) VALUES ($1, $2, $3, $4, $5, $6);', [address.name, address.address, address.cep, address.city, address.state, planId.rows[0].id]);
        return res.sendStatus(200);
    } catch (error) {
        if (error.message === 'invalid token') {
            return res.status(401).send({ message: 'token is invalid or has been tampered' });
        }
        if (error.message === 'jwt expired') {
            return res.status(401).send({ message: 'token expired' });
        }
        return res.status(500).send({ message: 'Server problem, please try again.' });
    }
}
