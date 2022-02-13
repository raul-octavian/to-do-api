const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const user = require('../models/user');
const sessionStorage = require('node-sessionstorage');
const { registerValidation, loginValidation } = require('../validate');


//register user
router.post('/register', async (req, res) => {


  //validate user inputs
  const { error } = registerValidation(req.body);
  
  if (error) {
    return res.status(400).json({ error: error.details[0].message })
  }

  //email exists
  
  const emailExists = await user.findOne({ email: req.body.email });

  if (emailExists) {
    return res.status(400).json({ error: "email exists, please login" })
  }

  //hash password
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);


  //create user object
  const userObj = new user({
    name: req.body.name,
    email: req.body.email,
    password
  });

  try {
    const savedUser = await userObj.save();
    res.json({ error: null, data: savedUser._id })

  } catch (err) {
    res.status(400).json({ error })
  }

});

router.post('/login', async (req, res) => {

  //validate

  const { error } = loginValidation(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message })
  }

  //find user

  const foundUser = await user.findOne({ email: req.body.email });

  if (!foundUser) {
    return res.status(400).json({ error: "email is wrong" })
  } else {
    sessionStorage.setItem('userID', foundUser._id);
    const USER_ID = sessionStorage.getItem('userID');
    console.log(USER_ID);
  }

  //check for password

  const validPass = await bcrypt.compare(req.body.password, foundUser.password);

  if (!validPass) {
    return res.status(400).json({ error: "password is wrong" })
  }

  //create auth token 

  const token = jwt.sign(
    //payload
    {
      name: foundUser.name,
      id: foundUser._id
    },

    //TOKEN_SECRET
    process.env.TOKEN_SECRET,

    //EXPIRATION
    { expiresIn: process.env.JWT_EXPIRES_IN },
  );
  //attach auth to header

  res.header("auth-token", token).json({

    error: null,
    data: { user_id: foundUser._id, token }
  });
  
})

module.exports =  router ;