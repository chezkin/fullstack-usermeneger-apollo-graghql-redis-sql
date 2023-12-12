import { gql } from "apollo-server";

const schema = gql`
type User {
  id: ID
  firstname: String!
  lastname: String!
  email: String!
  password: String!
  isadmin: Boolean!
} 

input UsersInput {
  id: ID
  firstname: String!
  lastname: String!
  email: String!
  password: String!
  isadmin: Boolean!
} 

type Mutation {
  registerUser(id: ID, firstname: String!, lastname: String!, email: String!, password: String!, isadmin: Boolean!): User
  updateUser(user: UsersInput): User
  deleteUser(user: UsersInput): User
}

  type Subscription {
    users: [User]
  }
`;

export default schema