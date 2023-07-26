const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID!
    name: String!
    email: String!
    groups: [Group]
  }

  type Group {
    _id: ID!
    name: String!
    password: String!
    users: [User]
    events: [Event]
  }

  type Event {
    _id: ID!
    name: String!
    category: String!
    startTime: String!
    endTime: String!
    group: Group!
  }

  type Query {
    users: [User]
    groups: [Group]
    events: [Event]
    group(id: ID!): Group
  }

  type Mutation {
    createGroup(name: String!, password: String!): Group
    joinGroup(groupName: String!, password: String!): Group
    signup(name: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    createEvent(name: String!, category: String!, startTime: String!, endTime: String!, groupId: ID!): Event
    updateEvent(id: ID!, name: String, category: String, startTime: String, endTime: String): Event
    deleteEvent(id: ID!): Event
  }

  type Auth {
    token: String!
    user: User
  }
  
`;

module.exports = typeDefs;