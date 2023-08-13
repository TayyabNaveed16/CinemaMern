var customer = require('../models/customer');
var admin = require('../models/admin');
var movie = require('../models/movie');
// const multer = require('multer');






//Get Methods
module.exports = function (req, res, next) {
    admin.find().sort('name').exec(function(err, results){
        if (err) {
            return next(err);
        }
        res.json(results);
    });
};

module.exports.home = function (req, res,) {
    res.render('index', { title: 'Express' });
};



module.exports.addmovie = function (req,res,next) {
    movie.create(req.body).then((movie) => {
        // console.log("Movie Added", movie);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(movie);
    },
    (err) => next(err))
    .catch((err) => next(err));
};



module.exports.addadmin = function (req,res,next) {
    admin.create(req.body).then((admin) => {
        console.log("Admin Added", admin);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(admin);
    },
    (err) => next(err))
    .catch((err) => next(err));
};


module.exports.deletemovie = function (req, res, next) {
    movie.deleteOne({name: req.params.name}, function (err, result) {
        if (err) return next(err);
        res.json(result);
    });
};

// To find customers 
// module.exports = function (req, res, next) {
//     customer.find().sort('name').exec(function(err, results){
//         if (err) {
//             return next(err);
//         }
//         res.json(results);
//     });
// };
