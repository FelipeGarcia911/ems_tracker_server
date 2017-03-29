var constants         = require('../constants');
module.exports = function(mongoose) {

    var vehicleSchema = new mongoose.Schema({
        user:           { type: String },
        password:       { type: String },
        name: 		    { type: String, default: '' },
        description: 	{ type: String, default: '' },
        latitude:  	    { type: String, default: '0.0' },
        longitude: 	    { type: String, default: '0.0' },
        adminId:        { type: String, default: '' },
        loginStatus:    { type: String, default: constants.OFFLINE_STATUS },
        onlineStatus:   { type: String, default: constants.OFFLINE_STATUS },
        dateCreated:    { type: Date, default: Date.now },
        dateUpdated:    { type: Date, default: Date.now },
        socketId: 	    { type: String, default: '' }
    });

    mongoose.model('Vehicle', vehicleSchema);

};