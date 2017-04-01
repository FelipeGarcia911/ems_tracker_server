// Load Libraries
// -------------------------------------------------------------------------------------------------------------------
var constants       = require('./app/constants');
var bodyParser      = require('body-parser');

var mongoose        = require('mongoose');

var methodOverride  = require('method-override');
var path            = require('path');

var express = require('express');
var app     = express();
var http    = require('http').Server(app);

var io      = require('socket.io')(http);
io.set('heartbeat timeout', constants.HEART_BEAT_TIMEOUT);
io.set('heartbeat interval', constants.HEART_BEAT_INTERVAL);
// -------------------------------------------------------------------------------------------------------------------

// Variables
// -------------------------------------------------------------------------------------------------------------------
var port    = process.env.PORT || 3000;
// -------------------------------------------------------------------------------------------------------------------

//Connection to DB
// -------------------------------------------------------------------------------------------------------------------
mongoose = mongoose.connect(constants.MONGO_DB_DEV_URL, function(err, res) {
    if(err) throw err;
    console.log('Connected to Database ');

    // Start server
    http.listen(port, function() {
        console.log('Our app is running on http://localhost:' + port);
    });
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

// --------------------------------------------------- API Routes ----------------------------------------------------
// Import Models and Controllers
// -------------------------------------------------------------------------------------------------------------------
var adminModel        = require('./app/models/admin')(mongoose);
var vehicleModel      = require('./app/models/vehicle')(mongoose);

var VehicleController = require('./app/controllers/api/VehiclesController');
var AdminController   = require('./app/controllers/api/AdminController');
// -------------------------------------------------------------------------------------------------------------------

// API - Route
// -------------------------------------------------------------------------------------------------------------------
var vehicle_routes = require('./app/routers/VehicleRouter')(express, VehicleController);
app.use('/api', vehicle_routes);

var admin_routes = require('./app/routers/AdminRouter')(express, AdminController);
app.use('/api', admin_routes);
// -------------------------------------------------------------------------------------------------------------------

// Socket - Route
// -------------------------------------------------------------------------------------------------------------------
var socket_route = require('./app/controllers/socket/SocketController')(io);
// -------------------------------------------------------------------------------------------------------------------
