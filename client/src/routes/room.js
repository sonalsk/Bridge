/* ------ IMPORTING FILES ------- */
import '../css/room.css'
import React, { useRef, useEffect } from "react";
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
    var localStream;

    useEffect(() => {
        // asking for audio and video access
        navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(stream => {
            
            // streaming the audio and video
            // storing the local stream
            userVideo.current.srcObject = stream;
            userStream.current = stream;
            localStream = stream;
            
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
            // joining the user after receiving
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
    }

    // user id of the person we are trying to call ( user b )
    // user b recieving the offer
    function createPeer(userID) {
        const peer = new RTCPeerConnection({
            // connecting the two servers
            iceServers: [
                {
                    urls: "stun:stun.stunprotocol.org"
                },
                {
                    urls: 'turn:numb.viagenie.ca',
                    credential: 'spider23',
                    username: 'sonalkushwaha039@gmail.com'
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

                // target can be user a or user b
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
    
    // receiving the remote stream of peer
    // attaching the video of partner
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
        localStream.getVideoTracks()[0].enabled = isVideo;
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
        localStream.getAudioTracks()[0].enabled = isAudio;
    }

    // Hanging up the call
    function hangUp() {
        localStream.getVideoTracks()[0].enabled = false;
        localStream.getAudioTracks()[0].enabled = false;
        window.location.replace("/");
    }

    // Sharing the Screen
    function shareScreen() {
        // asking for the display media along with the cursor movement of the user sharing the screen
        navigator.mediaDevices.getDisplayMedia({ cursor: true }).then(stream => {
            const screenTrack = stream.getTracks()[0];

            // finding the track which has a type "video", and then replacing it with the current track which is playing
            document.getElementById('ss').style.backgroundColor = '#bc1823';
            senders.current.find(sender => sender.track.kind === 'video').replaceTrack(screenTrack);

            // when the screenshare is turned off, replace the displayed screen with the video of the user
            screenTrack.onended = function() {
                senders.current.find(sender => sender.track.kind === "video").replaceTrack(userStream.current.getTracks()[1]);
                document.getElementById('ss').style.backgroundColor = '#302b70';
            }
        })
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

    return (
        <div>            
            <div id = "video-box">
                <video autoPlay ref = {userVideo} />
                <video autoPlay ref = {partnerVideo} />
            </div>
            
            <div id ="button-box">
                <button id="cp" onClick = {getUrl}> <i class="far fa-copy"></i> </button>
                <button id="av" onClick = {toggleAudio}> <i class="fas fa-microphone-slash"></i> </button>
                <button id="end" onClick = {hangUp}> <i class="fas fa-phone-square-alt fa-3x"></i> </button>
                <button id="avv" onClick = {toggleVideo}> <i class="fas fa-video"></i> </button>
                <button id="ss" onClick = {shareScreen}> <i class="fas fa-external-link-alt"></i> </button>
            </div>            
        </div>        
    );
};

export default Room;