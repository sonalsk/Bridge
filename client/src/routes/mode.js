/* ------ IMPORTING FILES ------- */
import '../css/navigation.css'
import React from 'react';
import { Card, Button } from 'react-bootstrap';
import home from '../assets/home.png';
import one from '../assets/one.png'
import group from '../assets/group.png'
import broadcast from '../assets/broadcast.png'

// Function to provide the user with 3 different choices
// one on one call, group call and broadcast

function Mode() {
    return (

        <div class="landing-page">
            {/* Welcome Page */}
            <section>
                <div class="row">
                    <div class="col-md-6 align-self-center welcome">
                        <h1>Welcome to </h1>
                        <h1>Bridge.</h1>
                        <p>A simple and elegant way to connect with your peers!</p>
                        <button class="homeButton" onClick={() => window.location.replace("/#choice")}>Get Started </button>
                    </div>
                    <div class="col-md-6 c2">
                        <img src={home} class="d-none d-md-block about-img"></img>
                    </div>
                </div>
            </section>

            {/* Choices */}
            <section id="choice">
                <div className="modeChoice">
                    <h1>Make a Call!</h1>
                    <p>Connect with your peers in three different ways!</p>

                    <div class="row">
                        <div class="col-12 col-md-4">
                            <Card className='customCard'>
                                <Card.Img id='customCardImg' variant="top" src={one} />
                                <Card.Body id='customCardText'>
                                    <Card.Title>One on One Call</Card.Title>
                                    {/* <Button href='/CreateRoom' class="homeButton">Get Started</Button> */}
                                    <button class="choiceButton" onClick={() => window.location.replace("/CreateRoom")}>
                                        Get Started
                                    </button>
                                </Card.Body>
                            </Card>
                        </div>

                        <div class="col-12 col-md-4">
                        <Card className='customCard'>
                                <Card.Img id='customCardImg' variant="top" src={group} />
                                <Card.Body id='customCardText'>
                                    <Card.Title>Group Call</Card.Title>
                                    <button class="choiceButton" onClick={() => window.location.replace("/CreateRoomGroup")}>
                                        Get Started
                                    </button>
                                </Card.Body>
                            </Card>
                        </div>

                        <div class="col-12 col-md-4">
                        <Card className='customCard'>
                                <Card.Img id='customCardImg' variant="top" src={broadcast} />
                                <Card.Body id='customCardText'>
                                    <Card.Title>Broadcast</Card.Title>
                                    <button class="choiceButton">
                                        Get Started
                                    </button>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            <div class="end"></div>
            
        </div>
    );
}

export default Mode;