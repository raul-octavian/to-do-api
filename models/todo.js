const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let todoSchema = new Schema({

  title: {
    type: String,
    required: true
  },
  user_id: {type: String, required :true},
  description: { type: String },
  status: { type: Number, min: 0, max: 2 , default:0},
  deadline: { type: Date, default: new Date(new Date().getTime() + 60 * 60 * 24 * 1000) },
  time: { type: Number, min: 0, max: 1440 }
  
});

module.exports = mongoose.model('todo', todoSchema);