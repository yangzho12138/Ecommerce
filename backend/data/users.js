import bcrypt from 'bcryptjs';

const users = [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: bcrypt.hashSync('123456', 10), // pw, rounds to hash
        isAdmin: true
    },
    {
        name: 'John Doe',
        email: 'jhon@example.com',
        password: bcrypt.hashSync('123456', 10),
    },
    {
        name: 'Yang Zhou',
        email: 'yang@example.com',
        password: bcrypt.hashSync('123456', 10),
    }
]

export default users;