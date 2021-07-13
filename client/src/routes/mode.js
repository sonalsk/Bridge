/* ------ IMPORTING FILES ------- */
import '../css/navigation.css'
import React from 'react';
import { Card } from 'react-bootstrap';
import home from '../assets/home.png';
import one from '../assets/one.png'
import group from '../assets/group.png'
import broadcast from '../assets/broadcast.png'
import chat from '../assets/chatting.png'

// Function to provide the user with 3 different choices
// one on one call, group call and broadcast

function Mode() {
    return (

        <div class="landing-page">           
            
            {/* Welcome Page */}
            <section className="main-welcome">
                <div class="row">
                    <div class="col-md-6 welcome">
                        <div>
                            <h1>Welcome to </h1>
                            <h1>Bridge.</h1>
                            <p>A simple and elegant way to connect with your peers!</p>
                            <button class="homeButton" onClick={() => window.location.replace("/#main-choice")}>Get Started </button>
                        </div>
                    </div>

                    <div class="col-md-6 image">
                        <div>
                            <img src={home} class="d-none d-md-block about-img"></img>
                        </div>
                    </div>
                </div>
            </section>

            {/* Choices */}
            <section id="main-choice">
                <div className="mode-choice">

                    <div class="row mode-heading">
                        <div className="heading">
                            <h1>Make a Call!</h1>
                            <p>Connect with your peers in four different ways!</p>
                        </div>
                    </div>

                    <div class="row mode-cards">
                       
                        <div class="col-12 col-md-3 eachCard">
                            <div>
                                <Card className='customCard'>
                                    <Card.Img id='customCardImg' variant="top" src={one} />
                                    <Card.Body id='customCardText'>
                                        <Card.Title>One on One Call</Card.Title>
                                        <button class="choiceButton" onClick={() => window.location.replace("/CreateRoom")}>
                                            Get Started
                                        </button>
                                    </Card.Body>
                                </Card>
                            </div>
                        </div>
                        
                        <div class="col-12 col-md-3 eachCard">
                            <div>
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
                        </div>

                        <div class="col-12 col-md-3 eachCard">
                            <div>
                                <Card className='customCard'>
                                    <Card.Img id='customCardImg' variant="top" src={chat} />
                                    <Card.Body id='customCardText'>
                                        <Card.Title>Chatting</Card.Title>
                                        <button class="choiceButton" onClick={() => window.location.replace("/ChatModes")}>
                                            Get Started
                                        </button>
                                    </Card.Body>
                                </Card>
                            </div>
                        </div>
                        
                        <div class="col-12 col-md-3 eachCard">
                            <div>
                                <Card className='customCard'>
                                    <Card.Img id='customCardImg' variant="top" src={broadcast} />
                                    <Card.Body id='customCardText'>
                                        <Card.Title>Broadcast</Card.Title>
                                        <button class="choiceButton" onClick={() => window.location.replace("/CreateRoomBroadcast")}>
                                            Get Started
                                        </button>
                                    </Card.Body>
                                </Card>
                            </div>
                        </div>

                    </div>

                </div>
            </section>  
            
            {/* Footer */}
            <footer class = "text-center footer">
                <p> This site is developed by
                    <a href = "https://www.linkedin.com/in/sonal-kushwaha/" target="_blank">
                        <span> Sonal Kushwaha </span>
                    </a>
                    <br></br>
                    <span>Last updated on July 12, 2021</span>
                    <p> &copy; 2021</p>
                </p>
            </footer>



        </div>
    );
}

export default Mode;