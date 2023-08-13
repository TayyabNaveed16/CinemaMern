var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var logger = require('morgan');
var cors = require('cors');
const dotenv = require('dotenv');
dotenv.config({ path: '.env'});

const uri = "mongodb://0.0.0.0:27017/cinema"

const connection = mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
.catch(error => console.log(error));
connection.then((db) => {
  console.log("Connected to Database");
}, (err) => {
  console.log(err);
});


var adminRouter = require('./app_server/routes/admin');
var customerRouter = require('./app_server/routes/customer');
var movieRouter = require('./app_server/routes/movie');



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use('/admin', adminRouter);
app.use('/customer', customerRouter);
app.use('/movie', movieRouter);

app.use(express.static('./build'));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './build', 'index.html'));
});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.all('*', function (req, res, next) {
  res.writeHead(404, { 'Content-Type': 'text/html' });
  res.end('404 - page not found');
})

module.exports = app;
