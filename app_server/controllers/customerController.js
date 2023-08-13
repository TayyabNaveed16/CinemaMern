const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
var customer = require('../models/customer');
const asyncHandler = require('express-async-handler');
var movie = require('../models/movie');

//Generate JWT

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}


//Post Methods

// @desc    Register new User 
// @Route   POST /customer/register
// @access  Public   
const register = asyncHandler(async (req, res) => {

    const { name, email, phoneNumber, password } = req.body

    if (!name || !email || !phoneNumber || !password) {
        res.status(401).json({ error: 'Please add all fields' });
    }

    //Checking if user exists 
    const userExists = await customer.findOne({ email })

    if (userExists) {
        res.status(405).json({ error: 'Customer Already Exists' });
        return;
    }

    //Hash Password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    //Create Customer 

    const user = await customer.create({
        name,
        email,
        phoneNumber,
        password: hashedPassword
    })

    if (user) {
        res.status(202).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error("Invalid Customer Data")
    }

})


// @desc    Authenticate a User 
// @Route   POST /customer/login
// @access  Public   
const login = asyncHandler(async (req, res) => {

    const { email, password } = req.body

    const user = await customer.findOne({ email })

    if (user && (await bcrypt.compare(password, user.password))) {
        res.status(202).json({
            message: "Success",
            _id: user.id,
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            token: generateToken(user._id)
        })
    } else {
        res.status(400).json({ error: 'Invalid Credentials' })
    }

})

// @desc    Get User Data
// @Route   GET /customer/profile
// @access  Private   
const profile = asyncHandler(async (req, res) => {

    res.status(200).json(req.user)

})


// @desc    Get Ticket Data
// @Route   GET /customer/ticket
// @access  Private   
const ticket = asyncHandler(async (req, res) => {
    const { email } = req.body

    // console.log(email);

    try {
        const customerInfo = await customer.findOne({ email }).select('-ticket._id')

        if (!customerInfo) {
            res.status(400).json({ error: 'Doesn\'t Exist' });
        } else {
            res.json(customerInfo.ticket);
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while querying the database' });
    }
});

// @desc    Book A Ticket
// @Route   PUT /customer/profile
// @access  Private   

const bookticket = asyncHandler(async (req, res) => {

    const { id } = req.user
    // console.log(req.user.name); Checked
    const moviename = await req.body.name
    const seats = await req.body.seats


    // console.log(name) Checked
    const movieExists = await movie.findOne({ moviename })

    if (!movieExists) {
        res.status(400).json({ error: 'Invalid Movie Name' })
    } else {
        movie.findOneAndUpdate({ name: moviename }, { $inc: { seats: -1 } }, function (err, result) {


            customer.findOneAndUpdate({ _id: id }, { $push: { ticket: { ticketNumber: seats, movieName: moviename } } }, { new: true }, function (err, result) {
                res.json(result);

            })
            if (err) res.status(400).json({ error: "Error in finding and updating movie seats" })
        })

    }

})

// db.edatabase.findOneAndUpdate({Salary: {$lt:10000}},{$inc:{Salary:2000}})

// @desc    Delete A Ticket
// @Route   PUT /customer/profile
// @access  Private   
const deleteticket = asyncHandler(async (req, res) => {

    const { id } = req.user

    if (!id) {
        res.status(401).json({ error: 'User not found' })
    } else {
        console.log(req.query.movieName);
        console.log(req.query.ticketNumber);

        customer.findOneAndUpdate({ _id: id }, { $pull: { ticket: { ticketNumber: req.query.ticketNumber, movieName: req.query.movieName } } }, { new: true }, function (err, result) {
            if (err) return next(err);
            res.json(result);
        });

    }
})

module.exports = {
    register,
    login,
    profile,
    ticket,
    bookticket,
    deleteticket
}
