module.exports = function(mongoose) {

    var adminSchema = new mongoose.Schema({
        user:           { type: String },
        password:       { type: String },
        name: 		    { type: String, default: 'User Admin' },
        description:    { type: String, default: 'Admin Description' }
    });

    mongoose.model('Admin', adminSchema);

};