var mongoose = require('mongoose');
var Vehicle  = mongoose.model('Vehicle');

//GET - Return all Vehicles in the DB
exports.findAllVehicles = function(req, res) {
    Vehicle.find(function(err, vehicles) {
        if(err) res.send(500, err.message);

        console.log('GET /Vehicles')
        res.status(200).jsonp(vehicles);
    });
};

//GET - Return a Vehicle with specified ID
exports.findById = function(req, res) {
    Vehicle.findById(req.params.id, function(err, vehicle) {
        if(err) return res.send(500, err.message);

        console.log('GET /Vehicle/' + req.params.id);
        res.status(200).jsonp(vehicle);
    });
};

//POST - Insert a new Vehicle in the DB
exports.addVehicle = function(req, res) {
    console.log('POST');
    console.log(req.body);

    var vehicle = new Vehicle({
        id: 		    req.body.id,
        name: 		    req.body.name,
        description: 	req.body.description,
        latitude:  	    req.body.latitude,
        longitude: 	    req.body.longitude,
        speed: 		    req.body.speed,
        lastUpdated:    req.body.lastUpdated,
        status:         req.body.status,
        socketId: 	    req.body.socketId
    });

    vehicle.save(function(err, vehicle) {
        if(err) return res.send(500, err.message);
        res.status(200).jsonp(vehicle);
    });
};

//PUT - Update a register already exists
exports.updateVehicle = function(req, res) {
    Vehicle.findById(req.params.id, function(err, vehicle) {
        vehicle.id          = req.body.id;
        vehicle.name        = req.body.name;
        vehicle.description = req.body.description;
        vehicle.latitude    = req.body.latitude;
        vehicle.longitude   = req.body.longitude;
        vehicle.speed       = req.body.speed;
        vehicle.lastUpdated = req.body.lastUpdated;
        vehicle.status      = req.body.status;
        vehicle.socketId    = req.body.socketId;

        vehicle.save(function(err) {
            if(err) return res.send(500, err.message);
            res.status(200).jsonp(vehicle);
        });
    });
};

//DELETE - Delete a Vehicle with specified ID
exports.deleteVehicle = function(req, res) {
    Vehicle.findById(req.params.id, function(err, vehicle) {
        vehicle.remove(function(err) {
            if(err) return res.send(500, err.message);
            res.status(200);
        });
    });
};