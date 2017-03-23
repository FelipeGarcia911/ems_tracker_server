module.exports = function(mongoose) {

    var vehicleSchema = new mongoose.Schema({
        user:           { type: String },
        password:       { type: String },
        name: 		    { type: String, default: '' },
        description: 	{ type: String, default: '' },
        latitude:  	    { type: String, default: '0.0' },
        longitude: 	    { type: String, default: '0.0' },
        isOnline:       { type: Boolean, default: false },
        dateCreated:    { type: Date, default: Date.now },
        dateUpdated:    { type: Date, default: Date.now },
        socketId: 	    { type: String, default: '' }
    });

    mongoose.model('Vehicle', vehicleSchema);

};