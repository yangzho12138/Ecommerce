// npm i jsonwebtoken
import jwt from 'jsonwebtoken'

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SCRETE, {
        expiresIn: '30d'
    }); // payload, screte key, option
}

export default generateToken;