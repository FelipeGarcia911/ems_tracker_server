var mongoose          = require('mongoose');
var Vehicle           = mongoose.model('Vehicle');

var query_generator = require('mongo-query-generator');

var constants         = require('../../constants');
var SocketResponseObj = require('../../objects/SocketMessageObj');

exports.updateVehiclePosition = function (data, socketId, callbackFunction) {
    var id          = data.id;
    var latitude    = data.latitude;
    var longitude   = data.longitude;

    Vehicle.findById(id, function(err, vehicle) {
        if(err){
            return new SocketResponseObj(constants.UPDATE_VEHICLE_POSITION_RESPONSE,'Vehiculo no Encontrado',constants.FAIL_STATUS);
        }else{
            vehicle.latitude     = latitude;
            vehicle.longitude    = longitude;
            vehicle.onlineStatus = constants.ONLINE_STATUS;
            vehicle.socketId     = socketId;

            vehicle.save(function (err, vehicle){
                if (err){
                    var socketResponse = new SocketResponseObj(constants.UPDATE_VEHICLE_POSITION_RESPONSE,'Vehiculo no Actualizado',constants.FAIL_STATUS);
                }else{
                    var socketResponse = new SocketResponseObj(constants.UPDATE_VEHICLE_POSITION_RESPONSE,'',constants.OK_STATUS);
                }
                callbackFunction(socketResponse);
            });
        }
    });
};

exports.handleVehicleDisconnect = function (socketId) {
    Vehicle.findOne({'socketId': socketId}, function(err, vehicle) {
        if (err){
            console.log('handleVehicleDisconnect', 'Error: '+err);
        }else if (vehicle !== null){
            vehicle.socketId = '';
            vehicle.onlineStatus = constants.OFFLINE_STATUS;
            vehicle.save(function (err, vehicle) {
                if (err) {
                    console.log('handleVehicleDisconnect', 'Error Saving: ' + err);
                } else {
                    console.log('handleVehicleDisconnect', 'Success');
                }
            });
        }else{
            console.log('handleVehicleDisconnect', 'Vehículo no encontrado');
        }
    });
};

exports.getOnlineVehiclesByAdminId = function (data, callbackFunction) {
    var adminId = data.adminId;

    var response = {};
    var responseStatus;
    var query = query_generator('adminId == "'+adminId+'" && loginStatus != "'+constants.LOGOUT_STATUS+'"');

    Vehicle.find(query,function(err, vehicles) {
        if (err){
            response.message = 'Error:'+err;
            responseStatus = constants.FAIL_STATUS;
        }else if (vehicles !== null){
            response.vehiclesData = vehicles;
            responseStatus = constants.OK_STATUS;
        }else{
            response.vehiclesData = [];
            responseStatus = constants.OK_STATUS;
        }
        var socketResponse = new SocketResponseObj(constants.GET_ALL_ONLINE_VEHICLE_POSITIONS_RESPONSE, response, responseStatus);
        callbackFunction(socketResponse);
    });
};
