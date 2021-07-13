/* ------ IMPORTING FILES ------- */
import React from "react";
import axios from 'axios';
import '../css/broadcast.css'

/* ------ JOINING A BROADCAST ------ */
const JoinBroadcast = (props) => {

    // calling the init function when user starts the stream
    window.onload = () => {
        document.getElementById('my-button').onclick = () => {
            init();
        }
    }

    // creating a peer
    async function init() {
        const peer = createPeer();
        peer.addTransceiver("video", { direction: "recvonly" })
        peer.addTransceiver("audio", { direction: "recvonly" })
    }

    // generating the offer
    function createPeer() {
        const peer = new RTCPeerConnection({
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' },
                { urls: 'stun:stun2.l.google.com:19302' },
                { urls: 'stun:stun3.l.google.com:19302' },
                { urls: 'stun:stun4.l.google.com:19302' },
            ]
        });
        peer.ontrack = handleTrackEvent;
        peer.onnegotiationneeded = () => handleNegotiationNeededEvent(peer);
        return peer;
    }

    // creating an offer and sending it to the consumer
    async function handleNegotiationNeededEvent(peer) {
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        const payload = {
            sdp: peer.localDescription
        };

        const { data } = await axios.post('/consumer', payload);
        const desc = new RTCSessionDescription(data.sdp);
        peer.setRemoteDescription(desc).catch(e => console.log(e));
    }

    // streaming the recieved object
    function handleTrackEvent(e) {
        document.getElementById("video").srcObject = e.streams[0];
    }

    // Hanging up the call
    function hangUp() {
        window.location.replace("/CreateRoomBroadcast");
    }

    return (
        <div>
            <div className="broadVideo">
                <video autoPlay id='video'></video>
            </div>

            <div className="btn-box">
                <button id='my-button' onClick = {init} className="streamBtn">View Stream</button>
                <button id='my-button' onClick = {hangUp} className="streamBtn">Stop Stream</button>
            </div>

            
        </div>
        
    );
}

export default JoinBroadcast;