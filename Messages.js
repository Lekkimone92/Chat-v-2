import React from 'react';
import { StyleSheet, Text, View,ScrollView,TextInput, Button } from 'react-native';
import { List, ListItem } from 'react-native-elements';
import { Query, graphql } from 'react-apollo';
import gql from 'graphql-tag';

const QUERY = gql`
  query allMessages {
    allMessages {
      text
    }
  }
`;

const CREATE_QUERY = gql`
  mutation createMessage($text: String!) {
    createMessage(text: $text) {
      text
    }
  }
`;

const NewMessageSubscription = gql`
subscription {
  Message(filter: {
    mutation_in: [CREATED]
  }) {
    node {
      text
    }
  }
}`;

class Messages extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      text: ''
    };
    this.send = this.send.bind(this);
  }

  componentDidMount() {
    this.subscription = (!this.props.messages)? 'shqjhfvj' : this.props.messages.subscribeToMore({
        document: NewMessageSubscription,
        updateQuery: (previousState, {subscriptionData}) => {
          const newMessage = subscriptionData.data.Message.node
          return {
            allMessages: [
              ...previousState.allMessages,
              {...newMessage}
            ]
          }
        },
        onError: (err) => console.error(err),
      });
 }

  send = (text) => {
     this.props.createMessage({
      variables: {
        text: this.state.text,
      }
    });
    this.state.text = '';
    console.log("voir si ça marche");
  }

  render(){
    const { messages, loading } = this.props;
    if (loading) return (<Text>Patientez chargement...</Text>)
    if(!messages.allMessages){
      return (<Text style={styles.load}>Chargement des données.....</Text>)
    }else {
      return (
        <View style={styles.container}>
          <ScrollView>
            <View>
              <List>
                {
                  messages.allMessages.map((message, i) => (
                    <ListItem
                      key={i}
                      title={message.text}
                    />
                  ))
                }
              </List>
            </View>
              <View>
                <TextInput
                  style={styles.input}
                  onChangeText={(text) => this.setState({text})}
                  value={this.state.text}
                  placeholder='message'
                  />
                <Button title="Send" disabled={!this.state.text} onPress={this.send} />

              </View>
          </ScrollView>
        </View>
      )
    }
  }

}

const MessagesSearchResults = graphql(QUERY, {name: 'messages'})(
  graphql(CREATE_QUERY, {name: 'createMessage'})(Messages)
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'space-between',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 10,
  },
  load: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 50,
  }
});

export default MessagesSearchResults;
