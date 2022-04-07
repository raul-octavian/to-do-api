const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let todoSchema = new Schema({

  title: {
    type: String,
    required: true
  },
  user_id: {
    type: Schema.Types.ObjectId
  },
  description: {
    type: String
  },
  status: {
    type: Number, min: 0, max: 2, default: 0
  },
  deadline: {
    type: Date,
    default: new Date(new Date().getTime() + 60 * 60 * 24 * 1000)
  },
  time: {
    type: Number, min: 0, max: 1440
  }

});

todoSchema.pre('findOneAndUpdate', function () {
  const update = this.getUpdate();
  if (update.__v != null) {
    delete update.__v;
  }
  const keys = ['$set', '$setOnInsert'];
  for (const key of keys) {
    if (update[key] != null && update[key].__v != null) {
      delete update[key].__v;
      if (Object.keys(update[key]).length === 0) {
        delete update[key];
      }
    }
  }
  update.$inc = update.$inc || {};
  update.$inc.__v = 1;
});

module.exports = mongoose.model('todo', todoSchema);