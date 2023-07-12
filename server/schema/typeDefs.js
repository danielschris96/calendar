const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
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
  }

  type Mutation {
    createGroup(name: String!, password: String!): Group
    joinGroup(groupId: ID!, userId: ID!, password: String!): Group
  }
`;

module.exports = typeDefs;