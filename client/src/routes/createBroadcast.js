/* ------ IMPORTING FILES ------- */
import React, { useRef } from "react";
import axios from 'axios';
import '../css/broadcast.css'

/* ------ CREATING A BROADCAST ------ */
const CreateBroadcast = (props) => {

    var userStream = useRef();
    var started = false;
    
    // calling the init function when user starts the stream
    window.onload = () => {
        document.getElementById('start').onclick = () => {
            init();
        }
    }

    // streaming our video and creating a peer
    async function init() {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        document.getElementById("video").srcObject = stream;
        userStream.current = stream;
        started = true;
        const peer = createPeer();
        stream.getTracks().forEach(track => peer.addTrack(track, stream));
    }

    // creating a peer and generating the offer
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
        peer.onnegotiationneeded = () => handleNegotiationNeededEvent(peer);
        return peer;
    }    

    // creating an offer and sending it to the server
    async function handleNegotiationNeededEvent(peer) {
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        const payload = {
            sdp: peer.localDescription
        };

        const { data } = await axios.post('/broadcast', payload);
        const desc = new RTCSessionDescription(data.sdp);
        peer.setRemoteDescription(desc).catch(e => console.log(e));
    }

    // Hanging up the call
    function hangUp() {
        if (started) {
            userStream.current.getVideoTracks()[0].enabled = false;
        }
        window.location.replace("/CreateRoomBroadcast");
    }

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


    return (
        <div class="bc">
            <div className="broadVideo">
                <video muted autoPlay id="video"></video>
            </div>

            <br></br>

            <div className="btn-box">
                <button id="av" onClick = {toggleAudio}> <i class="fas fa-microphone-slash"></i> </button>
                <button id='start' onClick = {init} className="streamBtn">Start Stream</button>
                <button id='stop' onClick = {hangUp} className="streamBtn">Stop Stream</button>
                <button id="avv" onClick = {toggleVideo}> <i class="fas fa-video"></i> </button>
            </div>
            
        </div>
        
    );
}

export default CreateBroadcast;