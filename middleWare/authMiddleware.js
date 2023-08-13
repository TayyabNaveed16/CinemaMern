const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
var customer = require('../app_server/models/customer');

const protect = asyncHandler(async (req, res, next) => {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {

            //get token from header
            token = req.headers.authorization.split(' ')[1]

            //verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            //Get User from token 
            req.user = await customer.findById(decoded.id).select('-password')
            // console.log(req.user);

            next()
        } catch (error) {
            console.log(error)
            res.status(401).json({ error: 'Not Authorized' })
        }
    }

    if (!token) {
        res.status(401).json({ error: 'Not Authorized, token not found' })
    }

})

module.exports = {protect}