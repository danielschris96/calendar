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
    groups: async (_, __, { user }) => {
      // Check if user is authenticated
      if (!user) {
        throw new Error('You are not authorized to view this information.');
      }
      // Only return groups the user is associated with
      return await Group.find({ users: user._id }).populate('users').populate('events');
    },
    events: async () => {
      return await Event.find().populate('group');
    },
    group: async (_, { id }) => {
      return await Group.findById(id).populate('events');
    },
  },

  Mutation: {
    createGroup: async (_, { name, password }, { user }) => {
      // Check if user is authenticated
      if (!user) {
        throw new Error('You are not authorized to create a group.');
      }

      const group = new Group({ name, password, users: [user._id] });
      await group.save();

      // Add the group to the user's groups list
      user.groups.push(group._id);
      await user.save();

      return group;
    },
    joinGroup: async (_, { groupId, userId, password }) => {
      const group = await Group.findById(groupId);

      if (!group) {
        throw new Error('Group not found.');
      }

      const validPassword = await bcrypt.compare(password, group.password);

      if (!validPassword) {
        throw new Error('Invalid password.');
      }

      // Add the user to the group's users list
      group.users.push(userId);
      await group.save();

      // Add the group to the user's groups list
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
    
    createEvent: async (_, { name, category, startTime, endTime, groupId }) => {
      const group = await Group.findById(groupId);
      if (!group) throw new Error('Group not found');

      const event = new Event({ name, category, startTime, endTime, group: groupId });
      await event.save();

      group.events.push(event._id);
      await group.save();

      return event;
    },

    updateEvent: async (_, { id, name, category, startTime, endTime }) => {
      // Find event by id and update it
      const event = await Event.findByIdAndUpdate(
        id,
        { name, category, startTime, endTime },
        { new: true } // This option asks mongoose to return the updated version of the document instead of the pre-updated one.
      );

      if (!event) throw new Error('Event not found');
      return event;
    },

    deleteEvent: async (_, { id }) => {
      // Find event by id and delete it
      const event = await Event.findByIdAndDelete(id);

      if (!event) throw new Error('Event not found');
      
      // Also need to remove the event from the group's events
      await Group.updateOne(
        { events: id }, 
        { $pull: { events: id } }
      );

      return event;
    },
  },
};

module.exports = resolvers;