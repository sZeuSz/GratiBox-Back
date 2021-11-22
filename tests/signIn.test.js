/* eslint-disable no-undef */
/* eslint-disable import/no-unresolved */
import supertest from 'supertest';
import setup from '../src/setup.js';
import app from '../src/app.js';
import { mockedUser } from '../src/controllers/mocks/userMocks.js';
import connection from '../src/database.js';
import { addNewSession } from '../src/factories/sessionsFactory.js';
import { deleteUser, insertUser } from '../src/factories/userFactory.js';

const agent = supertest(app);

afterAll(async () => {
    connection.end();
});

beforeEach(async () => {
    await deleteUser();
});

afterEach(async () => {
    await deleteUser();
});

describe('POST /signin', () => {
    beforeEach(async () => {
        await insertUser(
            mockedUser.name,
            mockedUser.email,
            mockedUser.hashedPassword(),
        );
        await addNewSession();
    });

    afterEach(async () => {
        await deleteUser();
    });

    test('Should return status code 200 and a body with user_id and token, if user is registered', async () => {
        const connectionData = {
            email: mockedUser.email,
            password: mockedUser.password,
        };

        const result = await agent.post('/grati-box/sign-in').send(connectionData);
        expect(result.status).toEqual(200);
        expect(result.body).toHaveProperty('token');
    });

    test('Sould return status code 400, if user is not registered or has passed invalid credentials', async () => {
        const connectionData = {
            email: mockedUser.email,
            password: mockedUser.fakePassword(),
        };

        const result = await agent.post('/grati-box/sign-in').send(connectionData);
        expect(result.status).toEqual(400);
        expect(result.body).toEqual({ message: 'Usuário ou senha incorretos.' });
    });
});
