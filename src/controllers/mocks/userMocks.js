/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-extraneous-dependencies */
import faker from 'faker';
import bcrypt from 'bcrypt';

const mockedUser = {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: `${faker.internet.password(8)}_9!`,
    confirmedPassword() {
        return this.password;
    },
    fakePassword() {
        return this.password.slice(1);
    },
    hashedPassword() {
        return bcrypt.hashSync(this.password, 10);
    },
};
export {
    mockedUser,
};
