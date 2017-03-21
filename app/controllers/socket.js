var constants                = require('../constants');
var onlineVehiclesController = require('./onlineVehicles');

module.exports = function(io){

    io.sockets.on('connection', function (socket) {

        socket.on(constants.GET_ALL_ONLINE_VEHICLES_POSITIONS_REQUEST,function(data){
            console.log('Request',data);
            var response = onlineVehiclesController.processGetAllOnlineVehiclesPosition();
            io.sockets.connected[socket.id].emit(constants.GET_ALL_ONLINE_VEHICLE_POSITIONS_RESPONSE,response);
            console.log('Response',response);
        });

        socket.on(constants.UPDATE_VEHICLE_POSITION_REQUEST,function(data){
            var messageData = data.data;
            var response = onlineVehiclesController.processUpdateVehiclePosition(messageData,socket.id);
            io.sockets.connected[socket.id].emit(constants.UPDATE_VEHICLE_POSITION_RESPONSE,response);
        });

        socket.on('disconnect',function () {
            handleUserDisconnected();
        });

    });

    function handleUserConnected(socketId) {

    }

    function handleUserDisconnected(socketId) {

    }

    return io;

};