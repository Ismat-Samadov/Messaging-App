const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { default: mongoose } = require('mongoose');
const cors = require('cors');

const apiRouter = require('./routes/api');
const errorHandler = require('./middleware/errorHandler');
const handle404 = require('./middleware/handle404');

require('dotenv').config();

const passport = require('passport');
const { strategy } = require('./config/passport');

const app = express();

mongoose.connect(process.env.DB_URL);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongo connection error'));

// Use JWT Strategy
passport.use(strategy);

// This will initialize the passport object on every request
app.use(passport.initialize());

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', apiRouter);

app.use(errorHandler);
app.use(handle404);

module.exports = app;
