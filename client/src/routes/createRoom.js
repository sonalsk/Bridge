/* ------ IMPORTING FILES ------- */
import React from "react";
// importing uuid to create and have unique ID for each room
import { v1 as uuid } from "uuid";
import one2one from '../assets/OneToOne.png';
import '../css/createRoom.css'
import { Modal, Button, Form } from 'react-bootstrap';
import emailjs from 'emailjs-com';


/* ------ CREATING A ROOM ------ */

const CreateRoom = (props) => {
    function create() {
        
        // creating the room id
        const id = uuid();
        
        // use the unique room id in the url
        // to redirect the user to the correct page
        props.history.push(`/room/${id}`);
    }

    function sendEmail(e) {
        e.preventDefault();    //This is important, i'm not sure why, but the email won't send without it

        emailjs.sendForm('gmail', 'template_kgfrx5w', e.target, 'user_nAYJJym0KTqRP8NWdzKqS')
          .then((result) => {
              window.location.reload()  //This is if you still want the page to reload (since e.preventDefault() cancelled that behavior) 
          }, (error) => {
              console.log(error.text);
          });
      }
      
    

    function MyVerticallyCenteredModal(props) {
        var id = window.location.href;
        return (
            
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
            
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                Send an Email Invitation
                </Modal.Title>
            </Modal.Header>
            
            <Modal.Body>

                
                <form className="contact-form" onSubmit={sendEmail}>
                    
                    <label>Name of Organiser</label>
                    <input type="text" name="from_name" />
                    <br></br>
                    <label>Email Address of Organiser</label>
                    <input type="email" name="from_email" />
                    <br></br>

                    <label>Name of Attendee</label>
                    <input type="text" name="to_name" />
                    <br></br>
                    <label>Email Address of Attendee</label>
                    <input type="email" name="to_email" />
                    <br></br>

                    <label>Date of the Meeting</label>
                    <input type="date" name="date" />
                    <br></br>

                    <label>Time of the Meeting</label>
                    <input type="time" name="time" />
                    <br></br>

                    <input type="text" name = "id" value={id}></input>

                    <br></br>
                    <input type="submit" value="Send" />
                    <Button onClick={props.onHide}>Close</Button>
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
                    <div class="col-md-6 c2">
                        <img src={one2one} class="d-none d-md-block about-img-cr"></img>
                    </div>
                    <div class="col-md-6 align-self-center welcomeCR">
                        <h1>One on One </h1>
                        <h1>Video Call with Bridge</h1>
                        <p>Join or Schedule a one to one <br></br> video call with your peers!</p>
                        
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

export default CreateRoom;

{/* <div class="row">
                <div class="col-6">
                    <Form>
                    <Form.Group controlId="organiser">
                        <Form.Label>Name of Organiser</Form.Label>
                        <Form.Control name="org" type="text" placeholder="Enter name" />
                    </Form.Group>

                    <Form.Group controlId="emailOrg">
                        <Form.Label>Email Address of Organiser</Form.Label>
                        <Form.Control name="org_email" type="email" placeholder="Enter email" />
                    </Form.Group>
                    </Form>
                </div>

                <div class="col-6">
                    <Form>
                    <Form.Group controlId="attendee">
                        <Form.Label>Name of Attendee</Form.Label>
                        <Form.Control name="att" type="text" placeholder="Enter name" />
                    </Form.Group>

                    <Form.Group controlId="emailAtt">
                        <Form.Label>Email Address of Attendee</Form.Label>
                        <Form.Control name="att_email" type="email" placeholder="Enter email" />
                    </Form.Group>
                    </Form>
                </div>
            </div>

            <div class="row">
                <div class="col">
                    <Form>
                    <Form.Group controlId="date">
                        <Form.Label>Date of the Meeting</Form.Label>
                        <Form.Control name="date" type="date" placeholder="Select Date" />
                    </Form.Group>
                    </Form>
                </div>
                <div class="col">
                    <Form>
                    <Form.Group controlId="time">
                        <Form.Label>Time of the Meeting</Form.Label>
                        <Form.Control name="time" type="time" placeholder="Select Time" />
                    </Form.Group>
                    </Form>
                </div>
            </div> */}