/* ------ IMPORTING FILES ------- */
import React from "react";
// importing uuid to create and have unique ID for each room
import { v1 as uuid } from "uuid";


/* ------ CREATING A ROOM ------ */

const CreateRoom = (props) => {
    function create() {
        
        // creating the room id
        const id = uuid();
        
        // use the unique room id in the url
        // to redirect the user to the correct page
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