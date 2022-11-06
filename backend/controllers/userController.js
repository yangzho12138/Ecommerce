import User from '../models/userModel.js';
import asyncHandler from 'express-async-handler' // async error handler
import generateToken from '../utils/generateToken.js';


// @desc Auth user & get token
// @route POST /api/users/login
// @access Public
const authUser = asyncHandler (async(req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email })

    if(user && (await user.matchPassword(password))){
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user.id)
        })
    }else{
        res.status(401) // unauth
        throw new Error('Invalid email or password');
    }
})

// @desc get user profile
// @route GET /api/users/profile
// @access Private
const getUserProfile = asyncHandler (async(req, res) => {
    const user = await User.findById(req.user._id) // add user info to req in auth middleware

    if(user){
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        })
    }else{
        res.status(404)
        throw new Error('User not found')
    }

})

// @desc Register a new user
// @route POST /api/users
// @access Public
const registerUser = asyncHandler(async(req, res) => {
    const { name, email, password } = req.body
    const userExists = await User.findOne({ email: email })

    if(userExists){
        res.status(400) // bad request
        throw new Error('User already exists')
    }

    const user = await User.create({name, email, password})

    if(user){
        res.status(201) // created
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user.id)
        })
    }else{
        res.status(400)
        throw new Error('Invalid user data')
    }
})


export {
    authUser,
    getUserProfile,
    registerUser
}