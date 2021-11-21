/* eslint-disable no-undef */
import supertest from 'supertest';
import bcrypt from 'bcrypt';
import setup from '../src/setup.js';
import connection from '../src/database.js';
import app from '../src/app';

beforeAll(async () => {
    await connection.query('DELETE FROM users');
});

afterAll(async () => {
    await connection.query('DELETE FROM users');
    connection.end();
});

describe('POST /grati-box/sign-up user', () => {
    beforeEach(async () => {
        await connection.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', ['rosenildo', 'rosenildo@hotmail.com', bcrypt.hashSync('password', 12)]);
    });

    afterEach(async () => {
        await connection.query('DELETE FROM users WHERE email = $1', ['rosenildo@hotmail.com']);
    });

    it('returns 400 invalid body, Empty body', async () => {
        const result = await supertest(app).post('/grati-box/sign-up').send({});

        expect(result.status).toEqual(400);
    });

    it('returns 201 valid body, create user', async () => {
        const body = {
            name: 'jenifi',
            email: 'jenifi@gmail.com',
            password: '12345678',
        };

        const resul = await supertest(app).post('/grati-box/sign-up').send(body);

        expect(resul.status).toEqual(201);
    });

    it('returns 409 for email has been used', async () => {
        const body = {
            name: 'rosenildo2',
            email: 'rosenildo@hotmail.com',
            password: '123456',
        };

        const resul = await supertest(app).post('/grati-box/sign-up').send(body);

        expect(resul.status).toEqual(409);
    });
});
