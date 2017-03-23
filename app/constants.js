var mongoDB_01_User = 'admin';
var mongoDB_01_Pass = 'ems_tracker';

module.exports = {

    // Vehicle Request
    GET_ALL_ONLINE_VEHICLES_POSITIONS_REQUEST : "GET_ALL_ONLINE_VEHICLES_POSITIONS_REQUEST",
    GET_ALL_ONLINE_VEHICLE_POSITIONS_RESPONSE : "GET_ALL_ONLINE_VEHICLE_POSITIONS_RESPONSE",

    //Update Vehicle Position
    UPDATE_VEHICLE_POSITION_REQUEST     : "UPDATE_VEHICLE_POSITION_REQUEST",
    UPDATE_VEHICLE_POSITION_RESPONSE    : "UPDATE_VEHICLE_POSITION_RESPONSE",

    //RESPONSE HTTP STATUS
    OK_STATUS   : 200,
    FAIL_STATUS : 400,

    //MongoDB Constants
    MONGO_DB_URI_01 : "mongodb://"+mongoDB_01_User+":"+mongoDB_01_Pass+"@ds060369.mlab.com:60369/ems_tracker_vehicles",
};