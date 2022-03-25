process.env.NODE_ENV = 'test';

const todo = require('../models/todo');
const user = require('../models/user');


before((done) => {
  todo.deleteMany({}, function (err) { });
  user.deleteMany({}, function (err) { });
  done();
});

after((done) => {
  todo.deleteMany({}, function (err) { });
  user.deleteMany({}, function (err) { });
  done();
})