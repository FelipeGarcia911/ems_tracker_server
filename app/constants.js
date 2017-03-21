var mongoDbDatabase   = 'mongodb-ems-tracker-server@admin';
var mongoDbPassword   = 'UkyykaEHl3VIf4qq';

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
    MONGO_DB_URI : 'mongodb://mongodb-ems-tracker-server:'+mongoDbPassword+'@mongodb-ems-tracker-server-shard-00-00-78jlx.mongodb.net:27017,mongodb-ems-tracker-server-shard-00-01-78jlx.mongodb.net:27017,mongodb-ems-tracker-server-shard-00-02-78jlx.mongodb.net:27017/'+mongoDbDatabase+'?ssl=true&replicaSet=mongodb-ems-tracker-server-shard-0&authSource=admin',

};