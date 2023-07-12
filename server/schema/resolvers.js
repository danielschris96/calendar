const User = require('./models/User');
const Group = require('./models/Group');
const Event = require('./models/Event');
const bcrypt = require('bcryptjs');

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
  },

  Mutation: {
    createGroup: async (_, { name, password }) => {
      const group = new Group({ name, password });
      await group.save();
      return group;
    },
    joinGroup: async (_, { groupId, userId, password }) => {
      const group = await Group.findById(groupId);
      const validPassword = await bcrypt.compare(password, group.password);

      if (!validPassword) {
        throw new Error('Invalid password');
      }

      group.users.push(userId);
      await group.save();

      const user = await User.findById(userId);
      user.groups.push(groupId);
      await user.save();

      return group;
    }
  }
};

module.exports = resolvers;