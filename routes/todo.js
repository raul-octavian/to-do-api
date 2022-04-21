const router = require('express').Router();
const todo = require('../models/todo');
const sessionStorage = require('node-sessionstorage');

const USER_ID = sessionStorage.getItem('userID');

// get all todos where the user_id matches the :user param, return all todos on success or message on fail or empty
router.get('/:user', (req, res) => {
  const user_id = req.params.user
  todo.find({ user_id: req.params.user })
    .then(data => {
      if (data.length) {

        //prep data and set uri for todo
        res.send(mapArray(data, user_id));
      } else {
        res.status(400).send({ message: "there are no todo items in your list, create some" })
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message })
    })
});

// create a new todo and set the :user param as user_id, returns todo if success or message, if fails

router.post('/create/:user', (req, res) => {

  data = req.body;
  user = req.params.user

  todo.insertMany({
    ...data,
    user_id: user
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({ message: err.message })
    })

});

// get all totos that match the :status prop, 0 for incomplete, 1 for active, and 2 for complete

router.get('/status/:status/:user', (req, res) => {
  const user_id = req.params.user
  const status = req.params.status
  let replay = `there are no results for status: ${+status}`
  todo.find({
    status: status, user_id: user_id
  })
    .then(data => {
      if (data.length) {
        res.send(mapArray(data, user_id));
      } else {
        res.status(400).send({ message: replay })
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message })
    })
});

// get one todo, that maches :id param, :user param is extra and not used
router.get('/:user/:id', (req, res) => {
  const user_id = req.params.user
  todo.findById(req.params.id)
    .then(data => {

      if (data) {
        res.send({
          ...data._doc,
          uri: `/api/todo/${user_id}/${data._doc._id}`
        });
      } else {
        res.status(400).send({ message: 'The todo with the id: ' + req.params.id + ' could not be found, make sure the id is correct' })
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message })
    })
});

// upates the todo where :id param matches the todo._id, :user param is not used. Return message and status for success or fail

router.put('/:user/:id', (req, res) => {
  id = req.params.id;

  todo.findByIdAndUpdate(id, req.body)
    .then(data => {
      if (!data) {
        res.status(400).send({ message: "cannot find todo with id " + id })
      } else {
        res.status(201).send({ message: "todo updated successfully" })
      }

    })
    .catch(err => {
      res.status(500).send({ message: "error updating the toto with id: " + id })
    })
});

// Delete the Todo that matches the :id param.

router.delete('/:user/:id', (req, res) => {
  id = req.params.id;

  todo.findByIdAndDelete(id)
    .then(data => {
      if (!data) {
        res.status(400).send({ message: "cannot find todo with id " + id })
      } else {
        res.status(201).send({ message: "todo deleted successfully" })
      }

    })
    .catch(err => {
      res.status(500).send({ message: "error updating the toto with id: " + id + "error: " })
    })
});

// set the uri on todo on get all

function mapArray(arr, user_id) {
  let outputArray = arr.map(item => {
    return {
      ...item._doc,
      //links
      uri: `/api/todo/${user_id}/${item._id}`
    }
  })
  return outputArray;
}

module.exports = router