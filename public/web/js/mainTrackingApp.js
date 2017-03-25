// Variables
//--------------------------------------------------------------------------------------------------
var gMap;
var socket;
var onlineVehicles = [];
//--------------------------------------------------------------------------------------------------

// Constants
//--------------------------------------------------------------------------------------------------
var constants = {
    UPDATE_VEHICLE_POSITION_REQUEST  : "UPDATE_VEHICLE_POSITION_REQUEST",
    UPDATE_VEHICLE_POSITION_RESPONSE : "UPDATE_VEHICLE_POSITION_RESPONSE",
    GET_ALL_ONLINE_VEHICLES_POSITIONS_REQUEST : "GET_ALL_ONLINE_VEHICLES_POSITIONS_REQUEST",
    GET_ALL_ONLINE_VEHICLE_POSITIONS_RESPONSE : "GET_ALL_ONLINE_VEHICLE_POSITIONS_RESPONSE",
    OK_STATUS   : 200,
    FAIL_STATUS : 400,
    ADMIN_COOKIE_NAME : 'adminCookie',
};
//--------------------------------------------------------------------------------------------------

// Objects
//--------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------

//Init Script Functions
//--------------------------------------------------------------------------------------------------
function initGoogleMap() {
    var mapProp = {
        center : new google.maps.LatLng(0.0,0.0),
        zoom : 3
    };
    gMap= new google.maps.Map(document.getElementById("googleMap"),mapProp);
}
// -------------------------------------------------------------------------------------

//Presenter Functions
//--------------------------------------------------------------------------------------------------
$( document ).ready(function() {
    onDocumentReady();

    $('#navSignOut').click(function () {
        onNavSignOutButtonClick();
    });
});

function showBody() {
    $('body').show();
}

function hideBody() {
    $('body').hide();
}

//Controller Functions
//--------------------------------------------------------------------------------------------------
function onDocumentReady() {
    if (checkUserAuth()){
        showBody();
        initSocketConnection();
        initAdminLocation();
        initVehicleSimulation();
    }else {
        hideBody();
        navigateToLogin()
    }
}

function onNavSignOutButtonClick() {
    deleteCookie(constants.ADMIN_COOKIE_NAME);
    navigateToLogin();
}

function navigateToLogin() {
    window.location.href = 'loginTrackingApp';
}

function checkUserAuth() {
    return checkCookie(constants.ADMIN_COOKIE_NAME);
}

//--------------------------------------------------------------------------------------------------

// Socket Functions
//--------------------------------------------------------------------------------------------------
function initSocketConnection(){
    socket = io();
    socket.on('new_message', function(msg){
        alert(msg);
    });
}

function sendSocketMessage(method,data) {
    if (socket !== null){
        socket.emit(method,data);
        return true;
    }else{
        return false;
    }
}

function newSocketMessage(method, data, status) {
    var socketMessageTemplate = {
        method: method,
        data: data,
        message: 'Response from WebApp',
        status: status,
        errorCode: '',
        errorMessage: '',
        setData: function (data) {
            this.data = data;
        }
    };
    return socketMessageTemplate;
}
//--------------------------------------------------------------------------------------------------

// Admin Functions
//--------------------------------------------------------------------------------------------------
function initAdminLocation() {
    var updateInterval = 2000;
    setInterval(function () {
        getVehiclePositions(constants.ADMIN_TOKEN);
    },updateInterval);
    listenAdminSocketMethods();
}

function getVehiclePositions(adminToken) {
    var data = {
        token : adminToken
    };
    var request = newSocketMessage(constants.GET_ALL_ONLINE_VEHICLES_POSITIONS_REQUEST,data,constants.OK_STATUS);
    var socketResponse = sendSocketMessage(request.method,request);
}

function listenAdminSocketMethods() {
    socket.on(constants.GET_ALL_ONLINE_VEHICLE_POSITIONS_RESPONSE,function (data) {
        onOnlineVehiclesResponse(data);
    });
}

function onOnlineVehiclesResponse(data) {
    var responseData = data.data;
    var onlineVehiclesCount = responseData.onlineCount;
    var onlineVehicleArray = responseData.vehiclesData;
    onlineVehicleArray.forEach(function (vehicle,index) {
        var newVehicle = createOnlineVehicle(vehicle.id, vehicle.latitude, vehicle.longitude,gMap);
        var isUpdated = updateOnlineVehicle(newVehicle);
        if (!isUpdated){
            addOnlineVehicle(newVehicle);
            newVehicle.showMarker();
            console.log("added!");
        }else{
            console.log("updated!");
        }
    });
}
//--------------------------------------------------------------------------------------------------

// Vehicle Simulation
//--------------------------------------------------------------------------------------------------
function initVehicleSimulation() {

    var updateInterval = 2000;

    setInterval(function () {
        var vehicleId = 'WEEFVRTB%$RVERVETVFVD';
        var currentLatLong = getCurrentLatLonPosition();
        updatePosition(vehicleId,currentLatLong.latitude,currentLatLong.longitude);

        var vehicleId = 'WEEFVRTB%$RVERVETSVDVSDVSDV';
        var currentLatLong = getCurrentLatLonPosition();
        updatePosition(vehicleId,currentLatLong.latitude,currentLatLong.longitude);

        var vehicleId = 'WEEFVRTB%';
        var currentLatLong = getCurrentLatLonPosition();
        updatePosition(vehicleId,currentLatLong.latitude,currentLatLong.longitude);

        var vehicleId = 'WEEFVRTB%$RVERVETDVSDVSDV';
        var currentLatLong = getCurrentLatLonPosition();
        updatePosition(vehicleId,currentLatLong.latitude,currentLatLong.longitude);

        var vehicleId = 'WEEFVRTB%VERVETSVDVSDVSDV';
        var currentLatLong = getCurrentLatLonPosition();
        updatePosition(vehicleId,currentLatLong.latitude,currentLatLong.longitude);

        var vehicleId = 'WEEFVRTB%$RVERVETSVSDVSDV';
        var currentLatLong = getCurrentLatLonPosition();
        updatePosition(vehicleId,currentLatLong.latitude,currentLatLong.longitude);

    },updateInterval);
}

function updatePosition(id, latitude, longitude){
    var data = {
        id        : id,
        latitude  : latitude,
        longitude : longitude
    };
    var resquest = newSocketMessage(constants.UPDATE_VEHICLE_POSITION_REQUEST,data,constants.OK_STATUS);
    var socketResponse = sendSocketMessage(resquest.method,resquest);
}

function getCurrentLatLonPosition() {
    var latlonPosition = {
        latitude  : randomInRange(0,50),
        longitude : randomInRange(0,50),
    };
    return latlonPosition;
}
//--------------------------------------------------------------------------------------------------

// Online Vehicles Functions
//--------------------------------------------------------------------------------------------------
function addOnlineVehicle(onlineVehicle) {
    onlineVehicles.push(onlineVehicle);
}

function deleteOnlineVehicle(id) {
    onlineVehicles.forEach(function (index,onlineVehicle) {
        if (onlineVehicle.getId() === id){
            onlineVehicles.splice(index,1);
        }
    });
}

function updateOnlineVehicle(newOnlineVehicle) {
    var isExecuted = false;
    onlineVehicles.forEach(function (onlineVehicle,index) {
        if (onlineVehicle.getId() === newOnlineVehicle.getId()){
            onlineVehicle.updatePosition(newOnlineVehicle.latitude, newOnlineVehicle.longitude);
            isExecuted = true;
        }
    });
    return isExecuted;
}

function createOnlineVehicle(id, latitude, longitude, gMap) {
    var myLatlng = new google.maps.LatLng(latitude,longitude);
    var onlineVehicle = {
        id          : id,
        latitude    : latitude,
        longitude   : longitude,
        latlong     : myLatlng,
        marker      : createMarker(myLatlng, id),
        gMap        : gMap,
        getId       : function () {
            return this.id;
        },
        updatePosition : function (latitude, longitude) {
            this.latitude   = latitude;
            this.longitude  = longitude;
            this.latlong    = new google.maps.LatLng(this.latitude,this.longitude);
            if (this.marker !== null) {
                this.marker.setPosition(this.latlong);
            }
        },
        showMarker : function () {
            if (this.gMap !== null && this.marker !== null){
                this.marker.setMap(this.gMap);
            }
        },
        hideMarker : function () {
            if (this.marker !== null){
                this.marker.setMap(null);
            }
        }
    };
    return onlineVehicle;
}

function createMarker(position, title) {
    var marker = new google.maps.Marker({
        position: position,
        title   : title
    });
    return marker;
}

//--------------------------------------------------------------------------------------------------

// Other Functions
//--------------------------------------------------------------------------------------------------
function checkCookie(cname) {
    var cookie = getCookie(cname);
    return cookie !== "";
}

function getCookie(cname) {
    var name = cname + '=';
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function deleteCookie(cname) {
    document.cookie = cname + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function randomInRange(min, max) {
    return Math.random() < 0.5 ? ((1-Math.random()) * (max-min) + min) : (Math.random() * (max-min) + min);
}
//--------------------------------------------------------------------------------------------------
