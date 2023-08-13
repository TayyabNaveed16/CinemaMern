var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var ctrlMain = require('../controllers/adminController.js');



//Get Routes
router.get('/', ctrlMain);

//Post Routes
router.post('/home', ctrlMain.addadmin);
router.post('/addAdmin', ctrlMain.addadmin);
router.post('/addMovie', ctrlMain.addmovie);


//Delete Routes
router.delete('/deleteMovie/:name', ctrlMain.deletemovie);


module.exports = router;
