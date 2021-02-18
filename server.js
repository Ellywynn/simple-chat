// server side script.
// it runs the server and responds for requests

// importing some stuff
const app = require('express')();
const path = require('path');
const httpServer = require('http').createServer(app);
const io = require("socket.io")(httpServer,
    // setting up CORS
    {
        cors: {
            origin: "*"
        }
    });

const PORT = 3000;

// when client sends GET request, send index page to it
app.get('/', (req, res) => {
    res.sendFile(__dirname + path.join('/public/index.html'));
})

// current connected users dictionary
// socket id : username
let users = {};

io.on('connection', socket => {
    console.log('a user connected');

    // when user disconnects
    socket.on('disconnect', () => {
        console.log('a user disconnected');
        // remove user from user dictionary
        delete users[socket.id];
    });

    // add user to the user dict
    socket.on('createUser', username => {
        users[socket.id] = username;
    });

    // send message to all connected users
    socket.on('message', (msg) => {
        socket.broadcast.emit('message', `${users[socket.id]}: ${msg}`);
    });

    socket.on('userJoined', () => {
        socket.broadcast.emit('userJoined', users[socket.id]);
    });
});

// start the server
httpServer.listen(PORT, () => {
    console.log(`Starting server at port ${PORT}...`)
});