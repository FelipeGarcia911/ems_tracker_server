var constants = require('../constants');
function OnlineVehicle(id, latitude, longitude, adminId, socketId, status) {
    this.id         = id;
    this.latitude   = latitude;
    this.longitude  = longitude;
    this.adminId    = adminId;
    this.socketId   = socketId;
    this.status     = status;

    OnlineVehicle.prototype.getId = function getId() {
        return this.id;
    };

    OnlineVehicle.prototype.getSocketId = function getSocketId() {
        return this.socketId;
    };

    OnlineVehicle.prototype.setLatitude = function setLatitude(latitude) {
        this.latitude = latitude;
    };

    OnlineVehicle.prototype.setLongitude = function setLongitude(longitude) {
        this.longitude = longitude;
    };

    OnlineVehicle.prototype.setOnlineStatus = function setOnlineStatus() {
        this.status = constants.ONLINE_STATUS;
    };

    OnlineVehicle.prototype.setOfflineStatus = function setOfflineStatus() {
        this.status = constants.OFFLINE_STATUS;
    };

    OnlineVehicle.prototype.getStatus = function getStatus() {
        return this.status;
    };


}

module.exports = OnlineVehicle;

