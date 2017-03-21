module.exports = function(mongoose) {

    var vehicleSchema = new mongoose.Schema({
        id: 		    { type: Number },
        name: 		    { type: String },
        description: 	{ type: String },
        latitude:  	    { type: String },
        longitude: 	    { type: String },
        speed: 		    { type: String },
        lastUpdated:    { type: String },
        status:         { type: String, enum: ['ONLINE','OFFLINE']},
        socketId: 	    { type: String }
    });

    mongoose.model('Vehicle', vehicleSchema);

};