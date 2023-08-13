var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const {
  register,
  login,
  profile,
  ticket,
  bookticket,
  deleteticket
} = require('../controllers/customerController.js')
const { protect } = require('../../middleWare/authMiddleware.js');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, profile);

router.post('/ticket', ticket);

router.put('/bookTicket', protect, bookticket);
router.put('/deleteTicket', protect, deleteticket);

module.exports = router;