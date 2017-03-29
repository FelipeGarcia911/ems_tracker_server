var constants       = require('../../constants');

var mongoose        = require('mongoose');
var Vehicle         = mongoose.model('Vehicle');
var Admin           = mongoose.model('Admin');

var ApiResponseObj  = require('../../objects/ApiResponseObj');

//GET - Login in the Database
exports.loginVehicle = function (req, res) {
    var response;
    Vehicle.findOne({'user':req.body.user, 'password': req.body.password}, function (err, vehicle) {
        if(err){
            response = new ApiResponseObj(500, '', 'Server Error:' + err.message);
            return res.send(response);
        }else if(vehicle === null){
            response = new ApiResponseObj(500, '','Usuario o contraseña Inválida');
            return res.send(response);
        }else{
            if (vehicle.loginStatus === constants.LOGIN_STATUS){
                response = new ApiResponseObj(500, '','Vehículo en linea actualmente!');
                return res.send(response);
            }else {
                vehicle.loginStatus = constants.LOGIN_STATUS;
                vehicle.save(function (err, vehicle) {
                    if (err) {
                        response = new ApiResponseObj(500, '', 'Server Error:' + err.message);
                    } else {
                        response = new ApiResponseObj(200, vehicle, 'Login Successful.');
                    }
                    return res.send(response);
                });
            }
        }
    });
};

//GET - Logout in the Database
exports.logoutVehicle = function (req, res) {
    var response = {};
    Vehicle.findById(req.body.id, function(err, vehicle) {
        if(err){
            response = new ApiResponseObj(500, '', 'Server Error:' + err.message);
            return res.send(response);
        }else if(vehicle === null){
            response = new ApiResponseObj(500, '','Vehículo no registrado!');
            return res.send(response);
        }else{
            vehicle.loginStatus = constants.LOGOUT_STATUS;
            vehicle.onlineStatus = constants.OFFLINE_STATUS;
            vehicle.save(function (err) {
                if(err){
                    response = new ApiResponseObj(500, '', 'Server Error:'+err.message);
                }else{
                    response = new ApiResponseObj(200, '','Logout Successful.');
                }
                return res.send(response);
            });
        }
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
            if (req.body.adminId.match(/^[0-9a-fA-F]{24}$/)) {
                Admin.findById(req.body.adminId, function (err, admin) {
                    if (err) {
                        response = new ApiResponseObj(500, '', err.message);
                        return res.send(response);
                    } else if (admin === null) {
                        response = new ApiResponseObj(200, admin, 'Admin not found!.');
                        return res.send(response);
                    } else {
                        var newVehicle = new Vehicle({
                            user:        req.body.user,
                            password:    req.body.password,
                            adminId:     req.body.adminId,
                            name:        req.body.name,
                            description: req.body.description
                        });
                        newVehicle.save(function (err, vehicle) {
                            if (err) {
                                response = new ApiResponseObj(500, '', "Vehicle not created: " + err.message);
                            } else {
                                response = new ApiResponseObj(200, vehicle, 'Vehicle created.');
                            }
                            return res.send(response);
                        });
                    }
                });
            }else{
                response = new ApiResponseObj(500, '','Invalid Admin ID, please check it and try again.');
                return res.send(response);
            }
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
        vehicle.user         = req.body.user;
        vehicle.password     = req.body.password;
        vehicle.name         = req.body.name;
        vehicle.description  = req.body.description;
        vehicle.latitude     = req.body.latitude;
        vehicle.longitude    = req.body.longitude;
        vehicle.onlineStatus = req.body.onlineStatus;

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

//----------------------------------------------------------------------------------------------------------------------