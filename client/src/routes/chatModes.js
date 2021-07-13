/* ------ IMPORTING FILES ------- */
import React from "react";
import { v1 as uuid } from "uuid";
import broadcastPage from '../assets/broadcastPage.png';
import '../css/createRoom.css'
import chat from '../assets/chatting.png'
import { Modal } from 'react-bootstrap';
import emailjs from 'emailjs-com';

// Function to give the user options to start a text chat
// Used uuid to create and have unique ID for each room

/* ------ CREATING A ROOM ------ */
const ChatModes = (props) => {

    // creating a room id
    // redirecting the user to the correct page
    function create() {
        const id = uuid();
        props.history.push(`/ChatRoomOne/${id}`);
    }

    return (
        <div>
            <section id="oo-lp">
                <div class="row">
                    <div class="col-md-6">
                        <img src={chat} class="d-none d-md-block about-img-cr"></img>
                    </div>
                    <div class="col-md-6 align-self-center welcomeCR">
                        <h1>One on One Text Chat</h1>
                        <h1>with Bridge</h1>
                        <p>Start a text chat with your peers!</p>
                        
                        <button class="schedule" onClick={() => window.location.replace("/")}> Home </button>
                        <button class="schedule" onClick = {create}> Start Chat </button>
                    </div>

                </div>
            </section>
        </div>
        
    );
}

export default ChatModes;