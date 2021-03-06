let dotenv = require('dotenv')
dotenv.config()
let fs = require('fs')
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let worker = require("./worker.js")
let { LOG_FILE } = require("./config/constants.js")

var indexRouter = require('./routes/index');
var domainsRouter = require('./routes/domains');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('common', {stream: fs.createWriteStream(LOG_FILE, { flags: 'a'})}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/domains', domainsRouter);

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

worker.boot();

module.exports = app;
