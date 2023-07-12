import { gql } from '@apollo/client';

export const GET_USERS = gql`
  query GetUsers {
    users {
      _id
      username
      email
      groups {
        _id
        name
      }
    }
  }
`;

export const GET_GROUPS = gql`
  query GetGroups {
    groups {
      _id
      name
      users {
        _id
        username
      }
      events {
        _id
        name
        category
        startTime
        endTime
      }
    }
  }
`;

export const GET_EVENTS = gql`
  query GetEvents {
    events {
      _id
      name
      category
      startTime
      endTime
      group {
        _id
        name
      }
    }
  }
`;