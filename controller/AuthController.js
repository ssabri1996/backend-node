const userModel = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async(req, res) => {
    if (!req.body) {
        res.status(400).json({ message: 'verify email or password ' });
    }
    const { username, password } = req.body

    // get user by email
    const user = await userModel.findOne({
        first_name: username,
        isAdmin: true,
    })

    if (user) {

        // if user is found check for password match
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (isPasswordMatch) {

            // Create a JWT token with a validity of 2 hours
            const JWTToken = jwt.sign({
                first_name: user.first_name,
                id: user._id,
            }, 'secret', {
                expiresIn: '14d'
            })
            res.status(200).json({ token: JWTToken, user: user._id })
        } else {
            res.status(400).json({ message: 'check your password' })
        }
    } else {
        res.status(400).json({ message: 'user not found' })
    }
}