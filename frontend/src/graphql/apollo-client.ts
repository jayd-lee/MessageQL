import { ApolloClient, InMemoryCache, ApolloProvider, gql, HttpLink, split } from '@apollo/client';
import { createClient } from 'graphql-ws'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities';
import { getSession } from 'next-auth/react';

const httpLink = new HttpLink({
  uri: 'https://messageql-api.vercel.app/graphql',
  credentials: 'include',
})

const wsLink = typeof window !== 'undefined' ? 
new GraphQLWsLink(
  createClient({
  url: 'ws://messageql-api.vercel.app/graphql/subscriptions',
  connectionParams: async() => ({
    session: await getSession(),
  })
}))
: null;

const link = typeof window !== 'undefined' && wsLink != null 
? 
split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
) 
: httpLink


export const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache(),
})