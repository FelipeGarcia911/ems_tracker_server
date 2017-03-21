module.exports = function(io){

    io.sockets.on('connection', function (socket) {

        io.emit('new_message','Bienvenido Perro Asqueroso!!!');

        socket.on('onConnect',function(data){
            io.socket.emit('response',"onConnect");
        });

        socket.on('onDisconnect',function(data){
            io.socket.emit('response',"onDisconnect");
        });

    });

    return io;

};