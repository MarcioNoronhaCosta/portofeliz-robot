import React from 'react';
import { GiftedChat } from 'react-web-gifted-chat';
 
class ChatComponent extends React.Component {
 
  state = {
    messages: [],
  };
 
  componentWillMount() {
    this.setState({
      messages: [
        {
          id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            id: 2,
            name: 'React',
            avatar: 'https://facebook.github.io/react/img/logo_og.png',
          },
        },
      ],
    });
  }
 
  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }
 
  render() {
    return (
      <div>
      <GiftedChat
        messages={this.state.messages}
        onSend={(messages) => this.onSend(messages)}
        user={{
          id: 1,
        }}
      />
      <h1>Alguma coisa</h1>
      </div>
    );
  }
 
}

export default ChatComponent;