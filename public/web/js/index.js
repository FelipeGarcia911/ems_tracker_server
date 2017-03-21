initSocketConnection();

function initSocketConnection() {

    var socket = io();
    socket.on('new_message', function(msg){
        alert(msg);
    });
}

