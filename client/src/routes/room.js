/* ------ IMPORTING FILES ------- */

import '../css/room.css'
import React, { useRef, useEffect } from "react";
import io from "socket.io-client";

const Room = (props) => {
    const userVideo = useRef();
    const partnerVideo = useRef();
    const peerRef = useRef();
    const socketRef = useRef();
    const otherUser = useRef();
    const userStream = useRef();

    var localStream;

    useEffect(() => {
        // asking for audio and video access

        navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(stream => {
            // streaming the audio and video
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
            // sending the answer back
            socketRef.current.on("answer", handleAnswer);
            // joining the user
            socketRef.current.on("ice-candidate", handleNewICECandidateMsg);

        });

    }, []);

    // Toggle Video
    let isVideo = true;
    function toggleVideo() {
        isVideo = !isVideo;
        localStream.getVideoTracks()[0].enabled = isVideo;
    }

    // Toggle Audio
    let isAudio = true;
    function toggleAudio() {
        isAudio = !isAudio;
        localStream.getAudioTracks()[0].enabled = isAudio;
    }
    
    // calling user
    function callUser(userID) {
        // taking peer ID
        peerRef.current = createPeer(userID);
        // streaming the user stream
        userStream.current.getTracks().forEach(track => peerRef.current.addTrack(track, userStream.current));
    }

    //user id of the person we are tyring to call - recieving the offer
    function createPeer(userID) {
        const peer = new RTCPeerConnection({
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

    // making the call
    function handleNegotiationNeededEvent(userID) {
        peerRef.current.createOffer().then(offer => {
            // setting the local description from the users offer
            return peerRef.current.setLocalDescription(offer);
        }).then(() => {
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
        // setting remote description
        peerRef.current.setRemoteDescription(desc).then(() => {
            userStream.current.getTracks().forEach(track => peerRef.current.addTrack(track, userStream.current));
        }).then(() => {
            // creating the answer
            return peerRef.current.createAnswer();
        }).then(answer => {
            // setting local description
            return peerRef.current.setLocalDescription(answer);
        }).then(() => {
            const payload = {
                target: incoming.caller,
                caller: socketRef.current.id,
                sdp: peerRef.current.localDescription
            }
            socketRef.current.emit("answer", payload);
        })
    }

    function handleAnswer(message) {
        const desc = new RTCSessionDescription(message.sdp);
        peerRef.current.setRemoteDescription(desc).catch(e => console.log(e));
    }

    // handling the events
    function handleICECandidateEvent(e) {
        if (e.candidate) {
            const payload = {
                target: otherUser.current,
                candidate: e.candidate,
            }
            socketRef.current.emit("ice-candidate", payload);
        }
    }

    function handleNewICECandidateMsg(incoming) {
        const candidate = new RTCIceCandidate(incoming);

        peerRef.current.addIceCandidate(candidate).catch(e => console.log(e));
    }
    
    function handleTrackEvent(e) {
        partnerVideo.current.srcObject = e.streams[0];
    };

    return (
        <div>            
            <div id = "video-box">
                <video autoPlay ref = {userVideo} />
                <video autoPlay ref = {partnerVideo} />
            </div>
            
            <div>
                <button onClick = {toggleVideo}> Video </button>
                <button onClick = {toggleAudio}> Audio </button>
            </div>
        </div>
        
    );
};

export default Room;