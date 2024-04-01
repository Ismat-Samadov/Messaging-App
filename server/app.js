const createError = require('http-errors');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
require("dotenv").config();

// Import routes
const indexRouter = require('./routes/index');
const messageScreenRouter = require('./routes/MessageScreen');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const usersRouter = require('./routes/users');
const convoRouter = require('./routes/convo');

const mongoDB = process.env.MONGODB_URI;

const app = express();

//app.use(cors());

app.use(cors({
  origin: "*", 
  credentials: true
}));

mongoose.set('strictQuery', false);

// Connect to MongoDB
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    const PORT = process.env.PORT || 8000
    app.listen(PORT, () => {
        console.log(`App is Listening on PORT ${PORT}`);
    })
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });

// Other middleware
app.use(express.static(path.join(__dirname, 'client/dist')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('uploads')); 
app.use(cookieParser());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

  // Add session middleware
  app.use(session({
    secret: 'cats',
    resave: false,
    saveUninitialized: false
  }));
  
  // Initialize passport and session
  app.use(passport.initialize());
  app.use(passport.session());

// Define routes
app.use('/', indexRouter, usersRouter);
app.use('/login', loginRouter);
app.use('/message', messageScreenRouter);
app.use('/message', usersRouter);
app.use('/message/users', convoRouter);
app.use('/logout', logoutRouter);

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
  res.json({
    message: err.message,
    error: err
  });
});

module.exports = app;
