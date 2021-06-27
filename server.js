/* ------ IMPORTING FILES ------- */


require("dotenv").config();
// importing express module
const express = require("express");
// importing http - built in node module
const http = require("http");
// creating app module
const app = express();
// creating a server and passing our application
const server = http.createServer(app);
// importing socket.io
const socket = require("socket.io");
// instance of io by taking the existing server
const io = socket(server);
const path = require("path");


/* ------ CREATING AND JOINING ROOMS FOR CONNECTION BETWEEN USERS ------ */

// room object to store the created room IDs
const rooms = {};

// when the user is forming a connection with socket.io
io.on("connection", socket => {
    
    // the join room event will get started from the client side
    // pulling roomID and checking for validity
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

});

if (process.env.PROD) {
    app.use(express.static(path.join(__dirname, './client/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, './client/build/index.html'));
    });
}


const port = process.env.PORT || 8000;
// server where the application will run locally
server.listen(port, () => console.log(`the web server is running on port ${port}`));