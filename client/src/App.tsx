// npm services
import react from "react";
import {
  ApolloClient,
  InMemoryCache,
  from, split, HttpLink
} from "@apollo/client";
import { ApolloProvider } from "@apollo/react-hooks";
import { onError } from "@apollo/client/link/error";
import { getMainDefinition } from "apollo-utilities";
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

// local services
import Home from "./components/Home";

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql'
});

const wsLink = new GraphQLWsLink(createClient({
  url: 'ws://localhost:4000/graphql',
  connectionParams: {
    // authToken: user.authToken,
  },
}));

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    );

  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache(),
});

function App() {
  return (
    <>
      <ApolloProvider client={client}>
      <div>hi from hell!!!</div>
        <Home />
      </ApolloProvider>
    </>
  )
}

export default App