/* ------ IMPORTING FILES ------- */
import React from "react";
// importing uuid to create and have unique ID for each room
import { v1 as uuid } from "uuid";
import one2one from '../assets/OneToOne.png';
import '../css/createRoom.css'

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
            <section id="oo-lp">
                <div class="row">
                    <div class="col-md-6 c2">
                        <img src={one2one} class="d-none d-md-block about-img-cr"></img>
                    </div>
                    <div class="col-md-6 align-self-center welcomeCR">
                        <h1>One on One </h1>
                        <h1>Video Call with Bridge</h1>
                        <p>Join or Schedule a one to one <br></br> video call with your peers!</p>
                        
                        <button class="schedule" onClick={() => window.location.replace("/")}> Home </button>
                        <button class="schedule"> Schedule Call </button>
                        <button class="schedule" onClick = {create}> Instant Call </button>
                    </div>
                </div>
            </section>
        </div>
        
    );
}

export default CreateRoom;