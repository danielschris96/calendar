const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const GroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  events: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event'
    }
  ]
});

GroupSchema.pre('save', async function(next) {
  // Check if password is modified, if not skip hashing
  if (!this.isModified('password')) {
      return next();
  }
  // Hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

const Group = mongoose.model('Group', GroupSchema);
module.exports = Group;