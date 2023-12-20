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

type Query {
  users: [User!]!
  userByID(id: ID!): User!
  userByEmail(email: String!): User!
}

type Mutation {
  registerUser(user: UsersInput): User
  loginUser(user: UsersInput): User
  updateUser(user: UsersInput): User
  deleteUser(user: UsersInput): User
}

  type Subscription {
    newUser: User
    numberOfRegisteredUsers: String
    numberOfConnectedUsers: String
  }
`;

export default schema