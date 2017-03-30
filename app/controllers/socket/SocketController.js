var constants                = require('../../constants');
var onlineVehiclesController = require('./OnlineVehiclesController');

module.exports = function(io){

    io.sockets.on('connection', function (socket) {

        socket.on(constants.GET_ALL_ONLINE_VEHICLES_POSITIONS_REQUEST,function(data){
            var messageData = data.data;
            onlineVehiclesController.getOnlineVehiclesByAdminId(messageData,function (response) {
                if(io.sockets.connected[socket.id] !== undefined) {
                    io.sockets.connected[socket.id].emit(constants.GET_ALL_ONLINE_VEHICLE_POSITIONS_RESPONSE, response);
                }
            });
        });

        socket.on(constants.UPDATE_VEHICLE_POSITION_REQUEST,function(data){
            var messageData = data.data;
            var response = onlineVehiclesController.updateVehiclePosition(messageData,socket.id,function (response) {
                if(io.sockets.connected[socket.id] !== undefined) {
                    io.sockets.connected[socket.id].emit(constants.UPDATE_VEHICLE_POSITION_RESPONSE, response);
                }
            });
        });

        socket.on('disconnect',function () {
            onlineVehiclesController.handleVehicleDisconnect(socket.id);
        });

    });

    return io;

};