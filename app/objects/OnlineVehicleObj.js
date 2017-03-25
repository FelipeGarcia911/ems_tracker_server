function OnlineVehicle(id, latitude, longitude, socketId, status) {
    this.id         = id;
    this.latitude   = latitude;
    this.longitude  = longitude;
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

    OnlineVehicle.prototype.setStatus = function setStatus(status) {
        this.status = status;
    };

    OnlineVehicle.prototype.getStatus = function getStatus() {
        return this.status;
    };
}

module.exports = OnlineVehicle;

