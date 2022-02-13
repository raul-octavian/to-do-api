const router = require('express').Router();
const todo = require('../models/todo');
const sessionStorage = require('node-sessionstorage');

const USER_ID = sessionStorage.getItem('userID');
console.log(USER_ID);


router.get('/', (req, res) => {
  
  todo.find({ user_id: '6207c264064f20d52d21ca2a'})
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

router.post('/create', (req, res) => {

  data = req.body;

  todo.insertMany(data)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({ message: err.message })
    })

});

router.get('/todoList', (req, res) => {

  todo.find({ status: 0, user_id: '6207c264064f20d52d21ca2a'})
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

router.get('/doing', (req, res) => {

  todo.find({ status: 1, user_id: '6207c264064f20d52d21ca2a'})
    .then(data => {
      if (data.length) {
        res.send(data); 
      } else 
      {
        res.status(400).send({ message: "there are no todo items active wright now" })
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message })
    })
});

router.get('/complete', (req, res) => {

  todo.find({ status: 2, user_id: '6207c264064f20d52d21ca2a' })
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

router.get('/:id', (req, res) => {

  todo.findById(req.params.id)
    .then(data => {
      
      if (data) {
        res.send(data);
      } else {
        res.status(400).send({ message: 'The todo with the id: ' + req.params.id + ' could not be found, make sure the id is correct'})
      }
    })
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