/* ------ IMPORTING FILES ------- */
import '../css/room.css'
import React, { useRef, useEffect, useState } from "react";
import io from "socket.io-client";

const Room = (props) => {

    // variables for different functionalities of video call
    const userVideo = useRef();
    const partnerVideo = useRef();
    const peerRef = useRef();
    const socketRef = useRef();
    const otherUser = useRef();
    const userStream = useRef();
    const senders = useRef([]);
    const sendChannel = useRef();
    const [text, setText] = useState("");
    const [messages, setMessages] = useState([]);
    var localStream;

    useEffect(() => {
        // asking for audio and video access
        navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(stream => {
            
            // streaming the audio and video
            // storing the local stream
            userVideo.current.srcObject = stream;
            userStream.current = stream;
            localStream = stream;

            document.getElementById('stop-s').style.display = 'none';
            
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
        });

    }, []);
    
    // calling user a ( who created the room )
    function callUser(userID) {
        // taking the peer ID
        peerRef.current = createPeer(userID);
        
        // streaming the user a stream
        // giving access to our peer of our individual stream
        // storing all the objects sent by the user into the senders array
        userStream.current.getTracks().forEach(track => senders.current.push(
                                                        peerRef.current.addTrack(track, userStream.current)));

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
                    credential: '',
                    username: ''
                },
            ]
        });

        peer.onicecandidate = handleICECandidateEvent;
        peer.ontrack = handleTrackEvent;
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
            userStream.current.getTracks().forEach(track => peerRef.current.addTrack(track, userStream.current));
        }).then(() => {
        
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
    
    // receiving the remote stream of peer and attaching the video of partner
    function handleTrackEvent(e) {
        partnerVideo.current.srcObject = e.streams[0];
    };

    // Toggle Video
    let isVideo = true;
    let colorVideo = '#bc1823';
    function toggleVideo() {
        document.getElementById('avv').style.backgroundColor = colorVideo;
        if (isVideo) {
            colorVideo = '#302b70';
        } else {
            colorVideo = '#bc1823';
        }
        isVideo = !isVideo;
        userStream.current.getVideoTracks()[0].enabled = isVideo;
    }

    // Toggle Audio
    let isAudio = true;
    let colorAudio = '#bc1823';
    function toggleAudio() {
        document.getElementById('av').style.backgroundColor = colorAudio;
        if (isAudio) {
            colorAudio = '#302b70';
        } else {
            colorAudio = '#bc1823';
        }
        isAudio = !isAudio;
        userStream.current.getAudioTracks()[0].enabled = isAudio;
    }

    // Hanging up the call
    function hangUp() {
        userStream.current.getVideoTracks()[0].enabled = false;
        window.location.replace("/CreateRoom");
    }

    // Sharing the Screen
    function shareScreen() {
        // asking for the display media along with the cursor movement of the user sharing the screen
        navigator.mediaDevices.getDisplayMedia({ cursor: true }).then(stream => {
            const screenTrack = stream.getTracks()[0];

            // finding the track which has a type "video", and then replacing it with the current track which is playing
            document.getElementById('ss').style.backgroundColor = '#bc1823';
            senders.current.find(sender => sender.track.kind === 'video').replaceTrack(screenTrack);
            
            document.getElementById('ss').style.display = 'none';
            document.getElementById('stop-s').style.backgroundColor = '#bc1823';
            document.getElementById('stop-s').style.display = 'inline';

            // when the screenshare is turned off, replace the displayed screen with the video of the user
            screenTrack.onended = function() {
                senders.current.find(sender => sender.track.kind === "video").replaceTrack(userStream.current.getTracks()[1]);
                document.getElementById('ss').style.backgroundColor = '#302b70';
            }
        });
    }

    // stopping screen share
    function stopShare() {
        senders.current.find(sender => sender.track.kind === "video").replaceTrack(userStream.current.getTracks()[1]);
        document.getElementById('stop-s').style.display = 'none';
        document.getElementById('ss').style.display = 'inline';
        document.getElementById('ss').style.backgroundColor = '#302b70';
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
        <div class="box">   
            <div class="row">
                <div class="col-12 col-md-9">
                    <div id = "video-box">
                        <video id="user" className="oneVideo" muted autoPlay ref = {userVideo} />
                        <video id="peer" className="oneVideo" autoPlay ref = {partnerVideo} />
                    </div>
                
                    <div id ="button-box">
                        <button id="cp" onClick = {getUrl}> <i class="far fa-copy"></i> </button>
                        <button id="av" onClick = {toggleAudio}> <i class="fas fa-microphone-slash"></i> </button>
                        <button id="end" onClick = {hangUp}> <i class="fas fa-phone-square-alt fa-3x"></i> </button>
                        <button id="avv" onClick = {toggleVideo}> <i class="fas fa-video"></i> </button>
                        <button id="ss" onClick = {shareScreen}> <i class="fas fa-external-link-alt"></i> </button>
                        <button id="stop-s" onClick = {stopShare} > <i class="far fa-stop-circle"></i> </button>
                    </div>

                </div>

                <div class="col-12 col-md-3 chat">
                    <div class="chatBox">
                        <div class="row text-area">
                            {messages.map(renderMessage)}
                        </div>
                        
                        <div class="row text-box">
                            <textarea class="text" value={text} onChange={handleChange} placeholder="Say Something..."/>
                            <button id="send" onClick={sendMessage}>Send</button>
                        </div>

                    </div>
                </div>
            </div>         
                        
        </div>        
    );
};

export default Room;
