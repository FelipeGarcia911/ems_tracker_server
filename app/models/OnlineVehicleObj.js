function OnlineVehicle(id, latitude, longitude, socketId){
    this.id          = id;
    this.latitude    = latitude;
    this.longitude   = longitude;
    this.socketId    = socketId;
}

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

module.exports = OnlineVehicle;

