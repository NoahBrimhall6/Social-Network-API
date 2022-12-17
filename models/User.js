const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  username: { 
    type: String, 
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'User email required!'],
    unique: true,
    validate: {
      validator: v => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v),
      message: props => `${props.value} is not a valid email!`
    }
  },
  thoughts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Thought'
    }
  ],
  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
});

const User = model('user', userSchema);

module.exports = User;