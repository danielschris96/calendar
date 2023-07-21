import { gql } from '@apollo/client';

export const GET_USERS = gql`
  query GetUsers {
    users {
      _id
      name
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
        name
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

export const GET_ALL_GROUPS = gql`
  query GetAllGroups {
    groups {
      _id
      name
    }
  }
`;

export const GET_GROUP_EVENTS = gql`
  query GetGroupEvents($groupId: ID!) {
    group(id: $groupId) {
      _id
      name
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
