import React from 'react';
import { ChatFeed } from 'react-bell-chat'
 
// Your code stuff...
 
class ChatComponent extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            messages: [
              {
                id: 1,
                authorId: 1,
                message: "Sample message",
                createdOn: new Date(),
                isSend: true
              },
              {
                id: 2,
                authorId: 2,
                message: "Second sample message",
                createdOn: new Date(),
                isSend: false
              },
            ],
            authors: [
              {
                id: 1,
                name: 'Mark',
                isTyping: true,
                lastSeenMessageId: 1,
                bgImageUrl: undefined
              },
              {
                id: 2,
                name: 'Peter',
                isTyping: false,
                lastSeenMessageId: 2,
                bgImageUrl: undefined
              }
            ]
          };
    }

    render() {
 
        return (
       
          // Your JSX...
       
          <ChatFeed
            messages={this.state.messages} // Array: list of message objects
            authors={this.state.authors} // Array: list of authors
            yourAuthorId={2} // Number: Your author id (corresponds with id from list of authors)
          />
       
          // Your JSX...
       
        )
       
      }
}

export default ChatComponent;

