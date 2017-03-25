module.exports = function(express, AdminApiController){

    var app = express.Router();

    app.route('/admin')
        .get(AdminApiController.findAllAdmins)
        .post(AdminApiController.addAdmin);

    app.route('/admin/:id')
        .get(AdminApiController.findById)
        .put(AdminApiController.updateAdmin)
        .delete(AdminApiController.deleteAdmin);

    app.route('/admin/login')
        .post(AdminApiController.loginAdmin);

    return app;
};