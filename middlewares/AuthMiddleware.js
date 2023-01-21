const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        // const token = req.headers.authorization.split(' ')[1];
        // // console.log(token);
        // if (!token) {
        //     throw (new Error('token not valid'))
        // }
        // const decodedToken = jwt.verify(token, `${process.env.SECRET}`);
        // if (!decodedToken) {
        //     throw (new Error('Unauthorized'))
        // }
        // // console.log(decodedToken.id);
        // res.locals.userId = decodedToken.id;
        next();
    } catch (error) {
        res.status(401).json({ error: error.message })
    }
}

module.exports = authMiddleware
