const router = require('express').Router();
const todo = require('../models/todo');


//admin routes

router.get('/admin/all', (req, res) => {

  todo.find()
    .then(data => {
      if (data.length) {
        res.send(data);
      } else {
        res.status(400).send({ message: "there are no todo items in your list, create some" })
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message })
    })
});

router.get('/admin/complete', (req, res) => {

  todo.find({ status: 2})
    .then(data => {
      if (data.length) {
        res.send(data);
      } else {
        res.status(400).send({ message: "there are no completed todo items wright now" })
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message })
    })
});

router.get('/admin/doing', (req, res) => {

  todo.find({ status: 1 })
    .then(data => {
      if (data.length) {
        res.send(data);
      } else {
        res.status(400).send({ message: "there are no todo items active wright now" })
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message })
    })
});

router.get('/admin/todoList', (req, res) => {

  todo.find({ status: 0 })
    .then(data => {
      if (data.length) {
        res.send(data);
      } else {
        res.status(400).send({ message: "there are no unfinished todo items wright now" })
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message })
    })
});



module.exports = router