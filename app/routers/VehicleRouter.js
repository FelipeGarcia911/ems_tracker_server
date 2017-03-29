module.exports = function(express, VehicleController){

    var app = express.Router();

    app.route('/vehicles')
        .get(VehicleController.findAllVehicles)
        .post(VehicleController.addVehicle);

    app.route('/vehicles/:id')
        .get(VehicleController.findById)
        .put(VehicleController.updateVehicle)
        .delete(VehicleController.deleteVehicle);

    app.route('/vehicles/login')
        .post(VehicleController.loginVehicle);

    app.route('/vehicles/logout')
        .post(VehicleController.logoutVehicle);


    return app;
};