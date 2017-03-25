var mongoose        = require('mongoose');
var Vehicle         = mongoose.model('Vehicle');
var ApiResponseObj  = require('../../objects/ApiResponseObj');

//GET - Login in the Database
exports.loginVehicle = function (req, res) {
    var response;
    Vehicle.findOne({'user':req.body.user, 'password': req.body.password}, function (err, vehicle) {
        if(err){
            response = new ApiResponseObj(500, '', err.message);
        }else if(vehicle === null){
            response = new ApiResponseObj(500, '','Invalid User or Password.');
        }else{
            response = new ApiResponseObj(200, vehicle,'Login Successful.');
        }
        return res.send(response);
    });
};

//GET - Return all Vehicles in the DB
exports.findAllVehicles = function(req, res) {
    var response;
    Vehicle.find(function(err, vehicles) {
        if(err){
            response = new ApiResponseObj(500, '', err.message);
        }else{
            response = new ApiResponseObj(200, vehicles,'Vehicles Obtained.');
        }
        return res.send(response);
    });
};

//GET - Return a Vehicle with specified ID
exports.findById = function(req, res) {
    var response;
    Vehicle.findById(req.params.id, function(err, vehicle) {
        if(err){
            response = new ApiResponseObj(500, '', err.message);
        }else{
            response = new ApiResponseObj(200, vehicle,'Vehicle Obtained.');
        }
        return res.send(response);
    });
};

//POST - Insert a new Vehicle in the DB
exports.addVehicle = function(req, res) {
    var response;
    Vehicle.findOne({'user':req.body.user},function (err, vehicle) {
        if (vehicle === null){
            var vehicle = new Vehicle({
                user:           req.body.user,
                password:       req.body.password,
                name: 		    req.body.name,
                description: 	req.body.description
            });
            vehicle.save(function(err, vehicle) {
                if(err){
                    response = new ApiResponseObj(500, '', err.message);
                }else{
                    response = new ApiResponseObj(200, vehicle, 'User created.');
                }
                return res.send(response);
            });
        }else{
            response = new ApiResponseObj(500,'','UserName duplicate, please select another.');
            return res.send(response);
        }
    });
};

//PUT - Update a register already exists
exports.updateVehicle = function(req, res) {
    var response;
    Vehicle.findById(req.params.id, function(err, vehicle) {
        vehicle.user        = req.body.user,
            vehicle.password    = req.body.password,
            vehicle.name        = req.body.name;
        vehicle.description = req.body.description;
        vehicle.latitude    = req.body.latitude;
        vehicle.longitude   = req.body.longitude;
        vehicle.isOnline    = req.body.isOnline;

        vehicle.save(function(err) {
            if(err){
                response = new ApiResponseObj(500, '', err.message);
            }else{
                response = new ApiResponseObj(200, vehicle,'Vehicle Updated.');
            }
            return res.send(response);
        });
    });
};

//DELETE - Delete a Vehicle with specified ID
exports.deleteVehicle = function(req, res) {
    var response;
    Vehicle.findByIdAndRemove(req.params.id, function (err, vehicle) {
        if(err){
            response = new ApiResponseObj(500, '', err.message);
        }else{
            response = new ApiResponseObj(200, vehicle,'Vehicles Deleted.');
        }
        return res.send(response);
    });
};