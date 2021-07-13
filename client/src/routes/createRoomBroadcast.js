/* ------ IMPORTING FILES ------- */
import React from "react";
import { v1 as uuid } from "uuid";
import broadcastPage from '../assets/broadcastPage.png';
import '../css/createRoom.css'
import { Modal } from 'react-bootstrap';
import emailjs from 'emailjs-com';

// Function to give the user options to schedule a group call or start instant group call
// Used uuid to create and have unique ID for each room

/* ------ CREATING A ROOM ------ */
const CreateRoomBroadcast = (props) => {

    // creating a room id
    // redirecting the user to the correct page
    function create() {
        props.history.push(`/createBroadcast`);
    }

    function join() {
        props.history.push(`/joinBroadcast`);
    }

    return (
        <div>
            <section id="oo-lp">
                <div class="row">
                    <div class="col-md-6">
                        <img src={broadcastPage} class="d-none d-md-block about-img-cr"></img>
                    </div>
                    <div class="col-md-6 align-self-center welcomeCR">
                        <h1>One to Many</h1>
                        <h1>Broadcast with Bridge</h1>
                        <p>Create a Broadcast Event for your peers!</p>
                        
                        <button class="schedule" onClick={() => window.location.replace("/")}> Home </button>
                        <button class="schedule" onClick = {create}> Start Broadcast </button>
                        <button class="schedule" onClick = {join}> Join Live </button>
                    </div>

                </div>
            </section>
        </div>
        
    );
}

export default CreateRoomBroadcast;