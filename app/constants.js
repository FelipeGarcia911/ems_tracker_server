var mongodb_user        = "admin";
var mongodb_password    = "ems_tracker_admin";

module.exports = {

    //Socket Configurations
    HEART_BEAT_TIMEOUT : 2000,
    HEART_BEAT_INTERVAL: 500,

    // Vehicle Request
    GET_ALL_ONLINE_VEHICLES_POSITIONS_REQUEST : "GET_ALL_ONLINE_VEHICLES_POSITIONS_REQUEST",
    GET_ALL_ONLINE_VEHICLE_POSITIONS_RESPONSE : "GET_ALL_ONLINE_VEHICLE_POSITIONS_RESPONSE",

    //Update Vehicle Position
    UPDATE_VEHICLE_POSITION_REQUEST     : "UPDATE_VEHICLE_POSITION_REQUEST",
    UPDATE_VEHICLE_POSITION_RESPONSE    : "UPDATE_VEHICLE_POSITION_RESPONSE",

    //RESPONSE HTTP STATUS
    OK_STATUS   : 200,
    FAIL_STATUS : 400,

    // Vehicle Status

    //Login Status
    LOGIN_STATUS : 'LOGIN',
    LOGOUT_STATUS: 'LOGOUT',

    //Connection Status
    ONLINE_STATUS       : "ONLINE",
    OFFLINE_STATUS      : "OFFLINE",

    //MongoDB Constants
    MONGO_DB_PROD_URL : "mongodb://"+mongodb_user+":"+mongodb_password+"@ds060369.mlab.com:60369/ems_tracker_prod_db",
    MONGO_DB_DEV_URL  : "mongodb://"+mongodb_user+":"+mongodb_password+"@ds060649.mlab.com:60649/ems_tracker_dev_db",
};