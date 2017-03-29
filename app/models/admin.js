module.exports = function(mongoose) {

    var adminSchema = new mongoose.Schema({
        user :           { type: String },
        password :       { type: String },
        token :          { type: String, default: Date.now },
        name : 	         { type: String, default: 'User Admin' },
        description :    { type: String, default: 'Admin Description' },
        map_latitude :   { type: String, default: '0.0' },
        map_longitude :  { type: String, default: '0.0' },
        map_zoom :       { type: String, default: '3' },
        dateCreated :    { type: Date, default: Date.now },
        dateUpdated  :   { type: Date, default: Date.now },
    });

    mongoose.model('Admin', adminSchema);

};