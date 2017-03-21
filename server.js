// Load Libraries
// -------------------------------------------------------------------------------------------------------------------
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
var dbName  = 'vehicles';
// -------------------------------------------------------------------------------------------------------------------

// Connection to DB
// -------------------------------------------------------------------------------------------------------------------
mongoose.connect('mongodb://localhost/' + dbName, function(err, res) {
    if(err) throw err;
    console.log('Connected to Database');
});
// -------------------------------------------------------------------------------------------------------------------

// App Configurations
// -------------------------------------------------------------------------------------------------------------------
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/css', express.static(__dirname + '/public/web/css'));
app.use('/js', express.static(__dirname + '/public/web/js'));
app.use(bodyParser.json());
app.use(methodOverride());
// -------------------------------------------------------------------------------------------------------------------

// Index - Route
// -------------------------------------------------------------------------------------------------------------------
var web_page_routes = require('./app/routers/webpage')(express, path);
app.use('/', web_page_routes);
// -------------------------------------------------------------------------------------------------------------------

// Socket - Route
// -------------------------------------------------------------------------------------------------------------------
var socket_route = require('./app/controllers/socket')(io);
// -------------------------------------------------------------------------------------------------------------------

// --------------------------------------------------- API Routes ----------------------------------------------------
// Import Models and Controllers
// -------------------------------------------------------------------------------------------------------------------
var vehicleModel        = require('./app/models/vehicle')(app, mongoose);
var VehicleController   = require('./app/controllers/vehicles');
// -------------------------------------------------------------------------------------------------------------------

// API - Route
// -------------------------------------------------------------------------------------------------------------------
var vehicle_routes = require('./app/routers/vehicles')(express, VehicleController);
app.use('/api', vehicle_routes);
// -------------------------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------------------------

// Start server
// -------------------------------------------------------------------------------------------------------------------
http.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});
// -------------------------------------------------------------------------------------------------------------------