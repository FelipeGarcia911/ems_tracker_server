// Load Libraries
// -------------------------------------------------------------------------------------------------------------------
var constants       = require('./app/constants');
var bodyParser      = require('body-parser');

var mongoose        = require('mongoose');

var methodOverride  = require("method-override");
var path            = require('path');

var express = require('express');
var app     = express();
var http    = require('http').Server(app);
var io      = require('socket.io')(http);
// -------------------------------------------------------------------------------------------------------------------

// Variables
// -------------------------------------------------------------------------------------------------------------------
var port    = process.env.PORT || 3000;
// -------------------------------------------------------------------------------------------------------------------

//Connection to DB
// -------------------------------------------------------------------------------------------------------------------
mongoose = mongoose.connect(constants.MONGO_DB_URI_01, function(err, res) {
    if(err) throw err;
    console.log('Connected to Database ');
});
// -------------------------------------------------------------------------------------------------------------------

// App Configurations
// -------------------------------------------------------------------------------------------------------------------
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/images', express.static(__dirname + '/public/web/images'));
app.use('/css', express.static(__dirname + '/public/web/css'));
app.use('/js', express.static(__dirname + '/public/web/js'));
app.use(bodyParser.json());
app.use(methodOverride());
// -------------------------------------------------------------------------------------------------------------------

// Index - Route
// -------------------------------------------------------------------------------------------------------------------
var web_page_routes = require('./app/routers/WebAppRouter')(express, path);
app.use('/', web_page_routes);
// -------------------------------------------------------------------------------------------------------------------

// Socket - Route
// -------------------------------------------------------------------------------------------------------------------
var socket_route = require('./app/controllers/socket/SocketIOController')(io);
// -------------------------------------------------------------------------------------------------------------------

// --------------------------------------------------- API Routes ----------------------------------------------------
// Import Models and Controllers
// -------------------------------------------------------------------------------------------------------------------
var vehicleModel        = require('./app/models/vehicle')(mongoose);
var VehicleController   = require('./app/controllers/api/VehiclesApiController');

var adminModel        = require('./app/models/admin')(mongoose);
var AdminController   = require('./app/controllers/api/AdminApiController');
// -------------------------------------------------------------------------------------------------------------------

// API - Route
// -------------------------------------------------------------------------------------------------------------------
var vehicle_routes = require('./app/routers/VehicleRouter')(express, VehicleController);
app.use('/api', vehicle_routes);

var admin_routes = require('./app/routers/AdminRouter')(express, AdminController);
app.use('/api', admin_routes);
// -------------------------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------------------------

// Start server
// -------------------------------------------------------------------------------------------------------------------
http.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});
// -------------------------------------------------------------------------------------------------------------------