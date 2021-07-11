/* ------ IMPORTING FILES ------- */
import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import CreateRoom from './createRoom';

// Function to redirect the user
// to the one on one video call functions

function oneOnone() {
  return (
    <div className="oneOnone">
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={CreateRoom} />
        </Switch>
      </BrowserRouter>
    </div>    
  );
}

export default oneOnone;
