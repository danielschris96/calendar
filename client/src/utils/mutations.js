import { gql } from '@apollo/client';

export const CREATE_GROUP = gql`
  mutation CreateGroup($name: String!, $password: String!) {
    createGroup(name: $name, password: $password) {
      _id
      name
    }
  }
`;

export const JOIN_GROUP = gql`
  mutation JoinGroup($groupId: ID!, $userId: ID!, $password: String!) {
    joinGroup(groupId: $groupId, userId: $userId, password: $password) {
      _id
      name
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($username: String!, $email: String!, $password: String!) {
    createUser(username: $username, email: $email, password: $password) {
      _id
      username
      email
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $username: String, $email: String, $password: String) {
    updateUser(id: $id, username: $username, email: $email, password: $password) {
      _id
      username
      email
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      _id
    }
  }
`;

export const CREATE_EVENT = gql`
  mutation CreateEvent($name: String!, $category: String!, $startTime: String!, $endTime: String!, $groupId: ID!) {
    createEvent(name: $name, category: $category, startTime: $startTime, endTime: $endTime, groupId: $groupId) {
      _id
      name
      category
      startTime
      endTime
    }
  }
`;

export const UPDATE_EVENT = gql`
  mutation UpdateEvent($id: ID!, $name: String, $category: String, $startTime: String, $endTime: String) {
    updateEvent(id: $id, name: $name, category: $category, startTime: $startTime, endTime: $endTime) {
      _id
      name
      category
      startTime
      endTime
    }
  }
`;

export const DELETE_EVENT = gql`
  mutation DeleteEvent($id: ID!) {
    deleteEvent(id: $id) {
      _id
    }
  }
`;