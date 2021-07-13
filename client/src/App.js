/* ------ IMPORTING FILES ------- */
import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import CreateRoom from "./routes/createRoom";
import Room from "./routes/room";
import './App.css';
import Mode from './routes/mode';
import CreateRoomGroup from './routes/createRoomGroup';
import RoomGroup from './routes/roomGroup';
import CreateRoomBroadcast from './routes/createRoomBroadcast';
import CreateBroadcast from './routes/createBroadcast';
import JoinBroadcast from './routes/joinBroadcast';
import ChatModes from './routes/chatModes';
import ChatRoomOne from './routes/chatRoomOne';

// Main function of the application
// Routes of different pages of the app are mentioned
// for use in the react application

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={Mode} />
          <Route path="/createRoom" component={CreateRoom} />
          <Route path="/room/:roomID" component={Room} />
          <Route path="/createRoomGroup" component={CreateRoomGroup} />
          <Route path="/roomGroup/:roomGroupID" component={RoomGroup} />
          <Route path="/createRoomBroadcast" component={CreateRoomBroadcast} />
          <Route path="/createBroadcast" component={CreateBroadcast} />
          <Route path="/joinBroadcast" component={JoinBroadcast} />
          <Route path="/ChatModes" component={ChatModes} />
          <Route path="/ChatRoomOne/:ChatRoomOneID" component={ChatRoomOne} />
        </Switch>
      </BrowserRouter>
    </div>    
  );
}

export default App;
