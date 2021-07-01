/* ------ IMPORTING FILES ------- */

// importing react
import React from "react";
// importing uuid to create and have unique ID for each room
import { v1 as uuid } from "uuid";


/* ------ CREATING A ROOM ------ */

const CreateRoom = (props) => {
    function create() {
        
        // create the room id
        const id = uuid();
        
        // use the unique room id in the url
        props.history.push(`/room/${id}`);
    }

    return (
        <div>
        <h1>One on One</h1>
        <button> Schedule </button>
        <button onClick = {create}> Create Room </button>
        </div>
        
    );
}

export default CreateRoom;