import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import AsyncHandler from 'express-async-handler';

const protect = AsyncHandler (async (req, res, next) => {
    let token

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, process.env.JWT_SCRETE)

            req.user = await User.findById(decoded.id).select('-password') // add info (except password to req)

            next()
        }catch (error){
            res.status(401)
            throw new Error('Not authorized, token failed')
        }
    }

    if(!token){
        res.status(401);
        throw new Error('Not authorized, no token')
    }
})

const admin = (req, res, next) => {
    if(req.user && req.user.isAdmin){
        next()
    }else{
        res.status(401)
        throw new Error('Not authorized as an admin')
    }
}

export {
    protect,
    admin,
}
