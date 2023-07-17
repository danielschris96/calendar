const User = require('../models/User');
const Group = require('../models/Group');
const Event = require('../models/Event');
const bcrypt = require('bcryptjs');
const { UserInputError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

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
    },
    signup: async (_, { name, email, password }) => {
      const user = await User.create({ name, email, password });
      const token = signToken(user);
  
      return { token, user };
    },
  
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
  
      if (!user) {
        throw new UserInputError('Incorrect email.');
      }
  
      const validPassword = await bcrypt.compare(password, user.password);
  
      if (!validPassword) {
        throw new UserInputError('Incorrect password.');
      }
  
      const token = signToken(user);
  
      return { token, user };
    },
  },
};

module.exports = resolvers;