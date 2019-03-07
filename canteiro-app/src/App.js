import React, { Component } from 'react';
import logo from './logo.svg';
import ChatComponent from './Components/ChatComponent';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
       
        <div>
          <h1>Futuro Chat</h1>
          <ChatComponent />
        </div>

      </div>
    );
  }
}

export default App;
