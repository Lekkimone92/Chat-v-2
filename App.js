import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { split } from 'apollo-link';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import {WebSocketLink} from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities';

import MessagesSearchResults from './Messages';


const httpLink = new HttpLink({ uri: "https://api.graph.cool/simple/v1/cjf888x5s49nw0161sd95fb65" })

//creation du client websocket
const wsClient = new WebSocketLink({
  uri: "wss://subscriptions.graph.cool/v1/cjf888x5s49nw0161sd95fb65",
  options: {
    reconnect: true
  }
});

const link = split(
    // split based on operation type
    ({query}) => {
        const {kind, operation} = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsClient,
    httpLink,
);

const client = new ApolloClient({
 link,
 cache: new InMemoryCache()
});


export default class App extends React.Component {

  render() {
    return (
      <ApolloProvider client={client}>
        <MessagesSearchResults />
      </ApolloProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
