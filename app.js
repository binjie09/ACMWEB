var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var session = require("express-session");
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var  router = require("./routes/router");
var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup

app.set('view engine', 'ejs');
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));





//顶层路由
app.use('/', index);
app.use('/users', users);
app.post("/doLogin",router.doLogin);
app.post("/saveInfo",router.saveInfo);
app.post("/orderInn",router.orderInn);
app.post("/alterPassword",router.alterPassword);
app.post("/deleteAllInn",router.deleteAllInn);
app.use('/admincbj',router.admin);









// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

module.exports = app;
app.listen(3001);