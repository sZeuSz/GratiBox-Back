import jwt from 'jsonwebtoken';
import connection from '../database.js';

export async function addNewSession() {
    const user = await connection.query('SELECT * FROM users');
    const data = {
        id: user.rows[0].id,
        token: jwt.sign({ email: user.rows[0].email }, process.env.JWT_SECRET, { expiresIn: '300s' }),
    };

    await connection.query(`
        INSERT INTO 
        sessions (user_id, token) 
        VALUES($1, $2); `, [data.id, data.token]);

    return data;
}

export const userAuthentication = async () => {
    const session = await connection.query('SELECT * FROM sessions;');

    const authentication = {
        user_id: session.rows[0].user_id,
        token: session.rows[0].token,
    };

    return authentication;
};
