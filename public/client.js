const socket = io('http://localhost:3000');

let messages = document.querySelector('#messages');
let input = document.querySelector('#input');

let username = '';

// asks user for entering the name
while (!username) {
    username = prompt('Enter your username, please');
}

socket.emit('createUser', username);
appendMessage('You joined');
socket.emit('userJoined');

socket.on('message', msg => {
    appendMessage(msg);
});

socket.on('userJoined', (username) => {
    appendMessage(`${username} joined`);
})

// when message is sent
document.querySelector('#form').addEventListener('submit', (e) => {
    // prevent default browser behaviour
    e.preventDefault();
    let text = input.value;
    // if text is not empty, push it
    if (text) {
        socket.emit('message', text);
        input.value = '';
        appendMessage(`You: ${text}`);
    }
    input.value = '';
});

// appends message
function appendMessage(msg) {
    let mes = document.createElement('li');
    mes.textContent = msg;
    messages.appendChild(mes);
}