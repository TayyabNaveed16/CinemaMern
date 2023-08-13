var customer = require('../models/customer');
var admin = require('../models/admin');
var movie = require('../models/movie');


//Get Methods
module.exports = function (req, res, next) {
    movie.find().sort('name').exec(function(err, results){
        if (err) {
            return next(err);
        }
        res.json(results);
    });
    // console.log("dasdasd");
};


