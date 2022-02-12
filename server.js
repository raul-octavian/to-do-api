const express = require('express');
const mongoose = require('mongoose');
const todoRoute = require('./routes/todo');
const userRoute = require('./routes/user');
require('dotenv-flow').config()


const app = express();

app.use(express.json());

//env variables
const port = process.env.PORT || 4000;

const host = process.env.DBHOST;

//database connect

mongoose.connect(host, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).catch(error => console.log('error connecting to database ' + error));

// mongoose.connection.once('open', () => console.log("connected to the database MongoDB"));
//base routes

app.use('/api/todo', todoRoute);
app.use('/api/user', userRoute);

//server start

app.listen(port, function() {
    console.log('Server is running')
})


module.exports = app;