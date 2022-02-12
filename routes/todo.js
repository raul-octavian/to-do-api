const router = require('express').Router();
const todo = require('../models/todo');



router.get('/', (req, res) => {
  
  todo.find()
    .then(data => { res.send(data); })
    .catch(err => {
      res.status(500).send({ message: err.message })
    })
});

router.post('/create', (res, req) => {

  data = req.body;

  todo.insertMany(data)
    .then(data => { res.send(data); })
    .catch(err => {
      res.status(500).send({ message: err.message })
    })

});

router.get('/todoList', (req, res) => {

  todo.find({status: 0})
    .then(data => { res.send(data); })
    .catch(err => {
      res.status(500).send({ message: err.message })
    })
});

router.get('/doing', (req, res) => {

  todo.find({ status: 1 })
    .then(data => { res.send(data); })
    .catch(err => {
      res.status(500).send({ message: err.message })
    })
});

router.get('/complete', (req, res) => {

  todo.find({ status: 2 })
    .then(data => { res.send(data); })
    .catch(err => {
      res.status(500).send({ message: err.message })
    })
});

router.get('/:id', (req, res) => {

  todo.findById(req.params.id)
    .then(data => { res.send(data); })
    .catch(err => {
      res.status(500).send({ message: err.message })
    })
});

router.put('/:id', (req, res) => {
  id = req.params.id;

  todo.findByIdAndUpdate(id, req.body)
    .then(data => {
      if (!data) {
        res.status(400).send({message:"cannot find todo with id " + id})
      } else {
        res.send({message: "todo updated successfully"})
      }

     })
    .catch(err => {
      res.status(500).send({ message: "error updating the toto with id: " + id })
    })
});

router.delete('/:id', (req, res) => {
  id = req.params.id;

  todo.findByIdAndDelete(id)
    .then(data => {
      if (!data) {
        res.status(400).send({ message: "cannot find todo with id " + id })
      } else {
        res.send({ message: "todo deleted successfully" })
      }

    })
    .catch(err => {
      res.status(500).send({ message: "error updating the toto with id: " + id + "error: "})
    })
});



module.exports = router