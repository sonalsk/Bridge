/* ------ IMPORTING FILES ------- */
import '../css/room.css'
import React, { useRef, useEffect, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";

const Video = (props) => {
    const ref = useRef();

    useEffect(() => {
        props.peer.on("stream", stream => {
            ref.current.srcObject = stream;
        })
    }, []);

    return (
        <video playsInline autoPlay ref={ref} />
    )
}

const videoConstraints = {
    height: window.innerHeight / 2,
    width: window.innerWidth / 2
};

const RoomGroup = (props) => {

    // variables for different functionalities of video call
    const [peers, setPeers] = useState([]);
    const socketRef = useRef();
    const userVideo = useRef();
    const peersRef = useRef([]);
    const userStream = useRef();
    const roomID =  props.match.params.roomID;

    useEffect(() => {
        socketRef.current = io.connect("/");
        
        navigator.mediaDevices.getUserMedia({ audio: true, video: videoConstraints }).then(stream => {
            userVideo.current.srcObject = stream;
            userStream.current = stream;
            socketRef.current.emit("join room group", roomID);
            
            socketRef.current.on("all users", users => {
                const peers = [];
                users.forEach(userID => {
                    const peer = createPeer(userID, socketRef.current.id, stream);
                    peersRef.current.push({
                        peerID: userID,
                        peer,
                    })
                    peers.push({
                        peerID: userID,
                        peer,
                    });
                })
                setPeers(peers);
            })

            socketRef.current.on("user joined", payload => {
                const peer = addPeer(payload.signal, payload.callerID, stream);
                peersRef.current.push({
                    peerID: payload.callerID,
                    peer,
                })

                const peerObj = {
                    peer,
                    peerID: payload.callerID
                }

                setPeers(users => [...users, peerObj]);
            });

            socketRef.current.on("receiving returned signal", payload => {
                const item = peersRef.current.find(p => p.peerID === payload.id);
                item.peer.signal(payload.signal);
            });

            // handling user disconnecting
            socketRef.current.on("user left", id => {
                // finding the id of the peer who just left
                const peerObj = peersRef.current.find(p => p.peerID === id);
                if (peerObj) {
                    peerObj.peer.destroy();
                }

                // removing the peer from the arrays and storing remaining peers in new array
                const peers = peersRef.current.filter(p => p.peerID !== id);
                peersRef.current = peers;
                setPeers(peers);
            })
        })
    }, []);

    function createPeer(userToSignal, callerID, stream) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });       

        peer.on("signal", signal => {
            socketRef.current.emit("sending signal", { userToSignal, callerID, signal })
        })

        return peer;
    }

    function addPeer(incomingSignal, callerID, stream) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        })

        peer.on("signal", signal => {
            socketRef.current.emit("returning signal", { signal, callerID })
        })

        peer.signal(incomingSignal);
        return peer;
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
        // localStream.getVideoTracks()[0].enabled = isVideo;
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
        // localStream.getAudioTracks()[0].enabled = isAudio;
        userStream.current.getAudioTracks()[0].enabled = isAudio;
    }

    return (
        <div class="row">
            <div col="col-12">
                <div>
                    <video muted ref={userVideo} autoPlay playsInline />
                    {peers.map((peer) => {
                        return (
                            <Video key={peer.peerID} peer={peer.peer} />
                        );
                    })}
                </div>

                <div id ="button-box">
                    <button id="cp" onClick = {getUrl}> <i class="far fa-copy"></i> </button>
                    <button id="av" onClick = {toggleAudio}> <i class="fas fa-microphone-slash"></i> </button>
                    {/* <button id="end" onClick = {hangUp}> <i class="fas fa-phone-square-alt fa-3x"></i> </button> */}
                    <button id="avv" onClick = {toggleVideo}> <i class="fas fa-video"></i> </button>
                    {/* <button id="ss" onClick = {shareScreen}> <i class="fas fa-external-link-alt"></i> </button> */}
                </div> 

                
            </div>
        </div>
           

        
    );
};

export default RoomGroup;