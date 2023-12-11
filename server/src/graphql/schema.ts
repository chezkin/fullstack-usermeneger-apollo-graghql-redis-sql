import { gql } from "apollo-server";

const schema = gql`
type User {
  id: ID
  name: String!
  email: String!
  password: String!
  isadmin: Boolean!
} 

input UsersInput {
  id: ID
  name: String!
  email: String!
  password: String!
  isadmin: Boolean!
} 

type Mutation {
  registerUser(id: ID, name: String!, email: String!, password: String!, isadmin: Boolean!): User
  updateUser(user: UsersInput): User
  deleteUser(user: UsersInput): User
}

  type Subscription {
    cpu: CPU
    traffic: Traffic
    distribution: [Distribution]
    messages: [Message]
  }
`;

export default schema