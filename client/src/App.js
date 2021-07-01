import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import CreateRoom from "./routes/createRoom";
import Room from "./routes/room";
import './App.css';
import Mode from './routes/mode';
function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={Mode} />
          <Route path="/createRoom" component={CreateRoom} />
          <Route path="/room/:roomID" component={Room} />
        </Switch>
      </BrowserRouter>
    </div>    
  );
}

export default App;
