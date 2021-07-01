import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { useHistory } from "react-router-dom";
import CreateRoom from './createRoom';
import Room from './room';

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
