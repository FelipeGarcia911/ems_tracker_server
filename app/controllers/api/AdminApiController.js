var mongoose        = require('mongoose');
var Admin           = mongoose.model('Admin');
var ApiResponseObj  = require('../../objects/ApiResponseObj');

//GET - Login in the Database
exports.loginAdmin = function (req, res) {
    var response;
    Admin.findOne({'user':req.body.user, 'password': req.body.password}, function (err, admin) {
        if(err){
            response = new ApiResponseObj(500, '', err.message);
        }else if(admin === null){
            response = new ApiResponseObj(500, '','Invalid User or Password.');
        }else{
            response = new ApiResponseObj(200, admin,'Login Successful.');
        }
        return res.send(response);
    });
};

//GET - Return all registers in the DB
exports.findAllAdmins = function(req, res) {
    var response;
    Admin.find(function(err, admins) {
        if(err){
            response = new ApiResponseObj(500, '', err.message);
        }else{
            response = new ApiResponseObj(200, admins,'Admins Obtained.');
        }
        return res.send(response);
    });
};

//GET - Return a register with specified ID
exports.findById = function(req, res) {
    var response;
    Admin.findById(req.params.id, function(err, admin) {
        if(err){
            response = new ApiResponseObj(500, '', err.message);
        }else{
            response = new ApiResponseObj(200, admin,'Admin Obtained.');
        }
        return res.send(response);
    });
};

//POST - Insert a new register in the DB
exports.addAdmin = function(req, res) {
    var response;
    Admin.findOne({'user':req.body.user},function (err, admin) {
        if (admin === null){
            var newAdmin = new Admin({
                user:           req.body.user,
                password:       req.body.password,
                name: 		    req.body.name,
            });

            newAdmin.save(function(err, admin) {
                if(err){
                    response = new ApiResponseObj(500, '', err.message);
                }else{
                    response = new ApiResponseObj(200, admin, 'Admin created.');
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
exports.updateAdmin = function(req, res) {
    var response;
    Admin.findById(req.params.id, function(err, admin) {
        admin.user        = req.body.user,
            admin.password    = req.body.password,
            admin.name        = req.body.name;
        admin.description = req.body.description;

        admin.save(function(err) {
            if(err){
                response = new ApiResponseObj(500, '', err.message);
            }else{
                response = new ApiResponseObj(200, admin,'Admin Updated.');
            }
            return res.send(response);
        });
    });
};

//DELETE - Delete a register with specified ID
exports.deleteAdmin = function(req, res) {
    var response;
    Admin.findByIdAndRemove(req.params.id, function (err, admin) {
        if(err){
            response = new ApiResponseObj(500, '', err.message);
        }else{
            response = new ApiResponseObj(200, admin,'Admin Deleted.');
        }
        return res.send(response);
    });
};