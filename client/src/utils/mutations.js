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