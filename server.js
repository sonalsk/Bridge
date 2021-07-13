/* ------ IMPORTING FILES ------- */
require("dotenv").config();
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);
const path = require("path");

const bodyParser = require('body-parser');
const webrtc = require('wrtc');
let senderStream;

/* ------ CREATING AND JOINING ROOMS FOR CONNECTION BETWEEN USERS ------ */

// room object to store the created room IDs
const rooms = {};
const users = {};
const socketToRoom = {};

// when the user is forming a connection with socket.io
io.on("connection", socket => {
    
    // handling one on one video call
    socket.on("join room", roomID => {
        
        // if the room is already created, that means a person has already joined the room
        // then take the new user and push them into the same room
        // else create a new room
        if (rooms[roomID]) {
            rooms[roomID].push(socket.id);
        } else {
            rooms[roomID] = [socket.id];
        }

        // finding otherUSer - see if id is of the other user
        const otherUser = rooms[roomID].find(id => id !== socket.id);
        // if someone has joined then we get the id of the other user
        if (otherUser) {
            socket.emit("other user", otherUser);
            socket.to(otherUser).emit("user joined", socket.id);
        }

    });

    // creating an offer and send the event to other user
    socket.on("offer", payload => {
        io.to(payload.target).emit("offer", payload);
    });

    // answering the call and sending it back to the original user
    socket.on("answer", payload => {
        io.to(payload.target).emit("answer", payload);
    });

    // finding the path with ice-candidate 
    socket.on("ice-candidate", incoming => {
        io.to(incoming.target).emit("ice-candidate", incoming.candidate);
    });

    // handling Group Video Call
    socket.on("join room group", roomID => {
        // getting the room with the room ID and adding the user to the room
        if (users[roomID]) {
            const length = users[roomID].length;

            // if 4 people have joined already, alert that room is full
            if (length === 4) {
                socket.emit("room full");
                return;
            }
            users[roomID].push(socket.id);
        } else {
            users[roomID] = [socket.id];
        }
        
        // returning new room with all the attendees after new attendee joined
        socketToRoom[socket.id] = roomID;
        const usersInThisRoom = users[roomID].filter(id => id !== socket.id);
        socket.emit("all users", usersInThisRoom);
    });

    // sending signal to existing members when user join
    socket.on("sending signal", payload => {
        io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
    });

    // signal recieved by the user who joined
    socket.on("returning signal", payload => {
        io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
    });

    // handling user disconnect in group call
    socket.on('disconnect', () => {
        
        // getting the room array with all the participants
        const roomID = socketToRoom[socket.id];
        let room = users[roomID];
        
        if (room) {
            // finding the person who left the room
            // creating a new array with the remaining people
            room = room.filter(id => id !== socket.id);
            users[roomID] = room;
        }

        // emiting a signal and sending it to everyone that a user left
        socket.broadcast.emit('user left', socket.id);
    });
});

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// accepting the broadcast offer and sending it back to the node server
app.post("/consumer", async ({ body }, res) => {
    const peer = new webrtc.RTCPeerConnection({
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' }
        ]
    });
    const desc = new webrtc.RTCSessionDescription(body.sdp);
    await peer.setRemoteDescription(desc);
    senderStream.getTracks().forEach(track => peer.addTrack(track, senderStream));
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    const payload = {
        sdp: peer.localDescription
    }

    res.json(payload);
});

// implementing broadcast
app.post('/broadcast', async ({ body }, res) => {

    // creating a peer connection only once
    const peer = new webrtc.RTCPeerConnection({
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' }
        ]
    });

    // recieving the offer and sending our own description
    peer.ontrack = (e) => handleTrackEvent(e, peer);
    const desc = new webrtc.RTCSessionDescription(body.sdp);
    await peer.setRemoteDescription(desc);
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    const payload = {
        sdp: peer.localDescription
    }

    res.json(payload);
});

function handleTrackEvent(e, peer) {
    senderStream = e.streams[0];
}

if (process.env.PROD) {
    app.use(express.static(path.join(__dirname, './client/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, './client/build/index.html'));
    });
}

const port = process.env.PORT || 8000;
server.listen(port, () => console.log(`the web server is running on port ${port}`));