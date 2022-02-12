const express = require('express');
const mongoose = require('mongoose');
const todoRoute = require('./routes/todo');
const userRoute = require('./routes/user');
require('dotenv-flow').config()


const app = express();
app.use(express.json());



app.use('api/todo', todoRoute);
app.use('api/user', userRoute);


module.exports = app;