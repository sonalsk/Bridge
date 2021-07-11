/* ------ IMPORTING FILES ------- */
import React from "react";
import { v1 as uuid } from "uuid";
import one2one from '../assets/OneToOne.png';
import groupPage from '../assets/groupPage.png';
import '../css/createRoom.css'
import { Modal} from 'react-bootstrap';
import emailjs from 'emailjs-com';

// Function to give the user options to schedule a group call or start instant group call
// Used uuid to create and have unique ID for each room

/* ------ CREATING A ROOM ------ */
const CreateRoomGroup = (props) => {

    // creating a room id
    // redirecting the user to the correct page
    function create() {
        const id = uuid();
        props.history.push(`/roomGroup/${id}`);
    }

    // creating a room id for scheduling a call
    function scheduleID() {
        const id = uuid();
        var url = window.location.href;
        var n = url.lastIndexOf('CreateRoomGroup');
        return url.substring(0, n - 1) + `/room/${id}`;
    }
    
    // sending an email to the user
    function sendEmail(e) {
        e.preventDefault();

        emailjs.sendForm('gmail', 'template_kr4bcy2', e.target, 'user_nAYJJym0KTqRP8NWdzKqS')
            .then((result) => {
                window.location.reload()
            }, (error) => {
                console.log(error.text);
            });
    }
      
    // modal for scheduling details
    function MyVerticallyCenteredModal(props) {
        var id = scheduleID();
        return (
            
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
            
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter" class="InvHeading">
                Send an Email Invitation
                </Modal.Title>
            </Modal.Header>
            
            <Modal.Body>
                <form className="contact-form" onSubmit={sendEmail}>
                    <div class="row">
                        <div class="col-6">
                            <label>Name of Organiser</label>
                            <input type="text" name="from_name" />

                            <label>Name of Attendee 1</label>
                            <input type="text" name="to_name_1" />

                            <label>Name of Attendee 2</label>
                            <input type="text" name="to_name_2" />

                            <label>Name of Attendee 3</label>
                            <input type="text" name="to_name_3" />
                            
                        </div>
                        <div class="col-6">

                            <label>Email Address of Organiser</label>
                            <input type="email" name="from_email" />

                            <label>Email Address of Attendee 1</label>
                            <input type="email" name="to_email_1" />

                            <label>Email Address of Attendee 2</label>
                            <input type="email" name="to_email_2" />

                            <label>Email Address of Attendee 3</label>
                            <input type="email" name="to_email_3" />
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-6">
                            <label>Date of the Meeting</label> <br></br>
                            <input type="date" name="date" />
                        </div>
                        <div class="col-6">
                            <label>Time of the Meeting</label> <br></br>
                            <input type="time" name="time" />
                        </div>
                    </div>

                    <div class="row my-4">
                        <div class="col-12">
                            <label>Link to the Meeting</label> <br></br>
                            <input type="text" name = "id" value={id}></input>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-6">
                            <input class="scheduleBtn" type="submit" value="Send" />
                            <button class="scheduleBtn" onClick={props.onHide}> Close </button>
                        </div>
                    </div>

                </form>
            </Modal.Body>
            </Modal>
        );
    }

    const [modalShow, setModalShow] = React.useState(false);

    return (
        <div>
            <section id="oo-lp">
                <div class="row">
                    <div class="col-md-6">
                        <img src={groupPage} class="d-none d-md-block about-img-cr"></img>
                    </div>
                    <div class="col-md-6 align-self-center welcomeCR">
                        <h1>Group Video Call</h1>
                        <h1>with Bridge</h1>
                        <p>Join or Schedule a group video call <br></br> with your peers!</p>
                        
                        <button class="schedule" onClick={() => window.location.replace("/")}> Home </button>
                        <button class="schedule" onClick={() => setModalShow(true)}> Schedule Call </button>
                        <MyVerticallyCenteredModal show={modalShow} onHide={() => setModalShow(false)}/>
                        <button class="schedule" onClick = {create}> Instant Call </button>
                    </div>

                </div>
            </section>
        </div>
        
    );
}

export default CreateRoomGroup;