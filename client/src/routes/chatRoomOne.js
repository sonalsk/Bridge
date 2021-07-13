/* ------ IMPORTING FILES ------- */
import '../css/chatRoom.css'
import React, { useRef, useEffect, useState } from "react";
import io from "socket.io-client";

const ChatRoomOne = (props) => {

    // variables for different functionalities of video call
    const peerRef = useRef();
    const socketRef = useRef();
    const otherUser = useRef();
    const sendChannel = useRef();
    const [text, setText] = useState("");
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // grabbing the room id from the url and then sending it to the socket io server
        socketRef.current = io.connect("/");
        socketRef.current.emit("join room", props.match.params.roomID);

        // user a is joining 
        socketRef.current.on('other user', userID => {
            callUser(userID);
            otherUser.current = userID;
        });

        // user b is joining
        socketRef.current.on("user joined", userID => {
            otherUser.current = userID;
        });

        // calling the function when made an offer
        socketRef.current.on("offer", handleRecieveCall);
        
        // sending the answer back to socket
        socketRef.current.on("answer", handleAnswer);
        
        // joining the user after receiving offer
        socketRef.current.on("ice-candidate", handleNewICECandidateMsg);

    }, []);
    
    // calling user a ( who created the room )
    function callUser(userID) {
        // taking the peer ID
        peerRef.current = createPeer(userID);
        // creating a data channel for chatting
        sendChannel.current = peerRef.current.createDataChannel("sendChannel");
        sendChannel.current.onmessage = handleReceiveMessage;                                 
    }

    // recieving the messages from the peer
    function handleReceiveMessage(e) {
        setMessages(messages => [...messages, {yours: false, value: e.data }]);
    }

    // user id of the person we are trying to call ( user b )
    // user b recieving the offer
    function createPeer(userID) {
        const peer = new RTCPeerConnection({
            // connecting the two servers
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' },
                { urls: 'stun:stun2.l.google.com:19302' },
                { urls: 'stun:stun3.l.google.com:19302' },
                { urls: 'stun:stun4.l.google.com:19302' },
                {
                    urls: 'turn:numb.viagenie.ca',
                    credential: 'spider23',
                    username: 'sonalkushwaha039@gmail.com'
                },
            ]
        });

        peer.onicecandidate = handleICECandidateEvent;
        peer.onnegotiationneeded = () => handleNegotiationNeededEvent(userID);

        return peer;
    }

    // ------ CREATING THE PEER TO PEER CONNECTION --------

    // making the call
    // when the actual offer is created, it is then sent to the other user
    function handleNegotiationNeededEvent(userID) {
        peerRef.current.createOffer().then(offer => {
            
            // setting the local description from the users offer
            return peerRef.current.setLocalDescription(offer);
        }).then(() => {
            
            // the person we are trying to make the offer to
            const payload = {
                target: userID,
                caller: socketRef.current.id,
                sdp: peerRef.current.localDescription
            };
            socketRef.current.emit("offer", payload);
        }).catch(e => console.log(e));
    }

    // recieving the call
    function handleRecieveCall(incoming) {
        peerRef.current = createPeer();

        // chatting
        peerRef.current.ondatachannel = (event) => {
            sendChannel.current = event.channel;
            sendChannel.current.onmessage = handleReceiveMessage;
        };
        
        // remote description
        const desc = new RTCSessionDescription(incoming.sdp);
        
        // setting remote description and attaching the stream
        peerRef.current.setRemoteDescription(desc).then(() => {        
            // creating the answer
            return peerRef.current.createAnswer();
        }).then(answer => {
        
            // setting local description
            return peerRef.current.setLocalDescription(answer);
        }).then(() => {

            // sending data back to the caller
            const payload = {
                target: incoming.caller,
                caller: socketRef.current.id,
                sdp: peerRef.current.localDescription
            }
            socketRef.current.emit("answer", payload);
        })
    }

    // function to handle the answer which the user a (who created the call) is receiving
    function handleAnswer(message) {
        const desc = new RTCSessionDescription(message.sdp);
        peerRef.current.setRemoteDescription(desc).catch(e => console.log(e));
    }

    // ------ END OF THE PEER TO PEER CONNECTION --------


    // handling the ice candidates
    function handleICECandidateEvent(e) {
        if (e.candidate) {
            const payload = {
                target: otherUser.current,
                candidate: e.candidate,
            }
            socketRef.current.emit("ice-candidate", payload);
        }
    }

    // swapping candidates until they reach on an agreement
    function handleNewICECandidateMsg(incoming) {
        const candidate = new RTCIceCandidate(incoming);
        peerRef.current.addIceCandidate(candidate).catch(e => console.log(e));
    }

    // handling text change when recieved
    function handleChange(e) {
        setText(e.target.value);
    }

    // sending message to the peer
    function sendMessage(e) {
        sendChannel.current.send(text);
        setMessages(messages => [...messages, { yours: true, value: text }]);
        setText("");
    }

    // Hanging up the call
    function hangUp() {
        window.location.replace("/ChatModes");
    }

    // Copy the Url
    function getUrl() {
        var inputc = document.body.appendChild(document.createElement("input"));
        inputc.value = window.location.href;
        inputc.focus();
        inputc.select();
        document.execCommand('copy');
        inputc.parentNode.removeChild(inputc);
        alert("URL Copied.");
    }

    // differentiating messages from user a and user b
    function renderMessage(message, index) {
        if (message.yours) {
            return (
                <div class="myRow" key={index}>
                    <div class="myMSG">
                        {message.value}
                    </div>
                </div>
            )
        }

        return (
            <div class="partnerRow" key={index}>
                <div class="partnerMSG">
                    {message.value}
                </div>
            </div>
        )
    }

    return (
        <div class="box-chat">   
            <div class="row">
                <div class="col-12 chat-one">
                    <div class="chatBox-one">
                        <div class="row text-area-one">
                            {messages.map(renderMessage)}
                        </div>
                        
                        <div class="row text-box-one">
                            <textarea class="text-one" value={text} onChange={handleChange} placeholder="Say Something..."/>
                            <button id="send" onClick={sendMessage}>Send</button>
                        </div>

                        <div id ="button-box">
                            <button id="cp-one" onClick = {getUrl}> Invite </button>
                            <button id="cp-one" onClick = {hangUp}> Stop </button>
                        </div>

                    </div>
                </div>
            </div>         
                        
        </div>        
    );
};

export default ChatRoomOne;