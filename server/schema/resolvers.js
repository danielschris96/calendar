const User = require('./models/User');
const Group = require('./models/Group');
const Event = require('./models/Event');

const resolvers = {
  Query: {
    users: async () => {
      return await User.find().populate('groups');
    },
    groups: async () => {
      return await Group.find().populate('users').populate('events');
    },
    events: async () => {
      return await Event.find().populate('group');
    },
  }
};

module.exports = resolvers;