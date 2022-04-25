const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let userSchema = new Schema({
  name: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  email: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  password: {
    type: String,
    required: true,
    min: 10,
    max: 255,
  }
},
  {
    timestamps: true
  });

module.exports = mongoose.model('user', userSchema);