const express = require('express');
const mongoose = require('mongoose');
const todoRoute = require('./routes/todo');
const userRoute = require('./routes/user');
const adminRoute = require('./routes/admin');
const { verifyToken } = require('./validate');
const swaggerUI = require('swagger-ui-express');
const cors = require('cors')
const yaml = require('yamljs');
require('dotenv-flow').config();


const app = express();
app.use(cors())

app.use(express.json());


//swagger implementation

const swaggerDefinition = yaml.load('./swagger.yaml');
app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(swaggerDefinition));


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
app.use('/api/user', userRoute);
app.use('/api/todo', adminRoute);
app.use('/api/todo', verifyToken, todoRoute);



//server start

app.listen(port, function () {
  console.log('Server is running')
})


module.exports = app;