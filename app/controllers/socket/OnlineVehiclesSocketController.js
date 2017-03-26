var constants         = require('../../constants');
var OnlineVehicleObj  = require('../../objects/OnlineVehicleObj');
var SocketResponseObj = require('../../objects/SocketMessageObj');

var onlineVehicles = [];

// --------------------------------- Functions to Control de Socket Methods ---------------------------------
// Return All de Data of Online Vehicles
exports.processGetAllOnlineVehiclesPosition = function () {
    var dataResponse = {
        onlineCount  : onlineVehicles.length,
        vehiclesData : onlineVehicles
    };

    var response = new SocketResponseObj(constants.GET_ALL_ONLINE_VEHICLE_POSITIONS_RESPONSE, dataResponse,constants.OK_STATUS);
    return response;
};

// Update the Vehicle Position
exports.processUpdateVehiclePosition = function (data, socketId) {
    var id          = data.id;
    var latitude    = data.latitude;
    var longitude   = data.longitude;
    var status      = constants.ONLINE_STATUS;
    console.log(data);
    var onlineVehicleData = createOnlineVehicle(id,latitude,longitude,socketId,status);
    var isUpdated = updateOnlineVehicle(onlineVehicleData);
    if (!isUpdated){
        addOnlineVehicle(onlineVehicleData);
    }

    var response = new SocketResponseObj(constants.UPDATE_VEHICLE_POSITION_RESPONSE,'',constants.OK_STATUS);
    return response;
};

exports.handleVehicleDisconnect = function (socketId) {
    var isExecuted = false;
    var vehicleId = getVehicleIdBySocketId(socketId);
    if (vehicleId !== false){
        isExecuted = removeOnlineVehicle(vehicleId);
    }
    return isExecuted;
};
// ----------------------------------------------------------------------------------------------------------------

function addOnlineVehicle(onlineVehicle) {
    onlineVehicles.push(onlineVehicle);
}

function removeOnlineVehicle(id) {
    var isExecuted = false;
    onlineVehicles.forEach(function (onlineVehicle,index) {
        if (onlineVehicle.getId() === id){
            onlineVehicles.splice(index,1);
            isExecuted = true;
        }
    });
    return isExecuted;
}

function updateOnlineVehicle(vehicleData) {
    var isExecuted = false;
    onlineVehicles.forEach(function (onlineVehicle,index) {
        if (onlineVehicle.getId() === vehicleData.getId()){
            onlineVehicles[index] = vehicleData;
            isExecuted = true;
        }
    });
    return isExecuted;
}

function createOnlineVehicle(id, latitude, longitude,socketId, status) {
    var response = new OnlineVehicleObj(id,latitude,longitude,socketId, status);
    return response;
}

function getVehicleIdBySocketId(socketId) {
    var isExecuted = false;
    onlineVehicles.forEach(function (onlineVehicle,index) {
        if (onlineVehicle.getSocketId() === socketId){
            isExecuted = onlineVehicle.getId();
        }
    });
    return isExecuted;
}
