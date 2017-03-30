// Variables
//--------------------------------------------------------------------------------------------------
var gMap;
var socket;
var adminCookie;
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

    UPDATE_TIME_INTERVAL : 2000,

    ADMIN_COOKIE_NAME : 'adminCookie',

    URL_SERVER      : './api/',
    VEHICLE_DATA    : 'vehicles/',

    ONLINE_MARKER_ICON  : 'images/map_marker_online_small.png',
    OFFLINE_MARKER_ICON : 'images/map_marker_offline_small.png',

    // Vehicle Status
    //Connection Status
    ONLINE_STATUS       : "ONLINE",
    OFFLINE_STATUS      : "OFFLINE",
};
//--------------------------------------------------------------------------------------------------

// Objects
//--------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------

//Init Script Functions
//--------------------------------------------------------------------------------------------------
function initGoogleMap() {
    var map_latitude = 0.0;
    var map_longitude = 0.0;
    var map_zoom = 3;

    adminCookie = getAdminCookie();
    if (adminCookie !== null) {
        if (adminCookie.map_latitude !== undefined) {
            map_latitude = adminCookie.map_latitude;
        }
        if (adminCookie.map_longitude !== undefined) {
            map_longitude = adminCookie.map_longitude;
        }
        if (adminCookie.map_zoom !== undefined) {
            map_zoom = parseInt(adminCookie.map_zoom);
        }
    }

    gMap= new google.maps.Map(
        document.getElementById("googleMap"), {
            center : new google.maps.LatLng(map_latitude, map_longitude),
            zoom   : map_zoom
        });
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

function setVehicleName(string) {
    $('#vehicleName').html(string);
}

function setVehicleName(string) {
    $('#vehicleName').html(string);
}

function setVehicleAddress(string) {
    $('#vehicleAddress').html(string);
}

function setVehicleDescription(string) {
    $('#vehicleDescription').html(string);
}

function showMessage(message) {
    $('#alertText').html(message);
    showAlertDialog();
    setTimeout(function () {
        hideAlertDialog();
    },3000)
}

function showAlertDialog() {
    $('#alertDialog').show();
}

function hideAlertDialog() {
    $('#alertDialog').hide();
}

function showProgressBar(){
    $('#progressBar').show();
}

function hideProgressBar(){
    $('#progressBar').hide();
}

function showVehicleModal(){
    $('#vehicleModal').modal('show');
}

function hideVehicleModal(){
    $('#vehicleModal').modal('hide');
}

//Controller Functions
//--------------------------------------------------------------------------------------------------
function onDocumentReady() {
    if (checkUserAuth()) {
        showBody();
        initSocketConnection();
        initSocketConnection();
        initAdminLocation();
        //initVehicleSimulation();
    } else {
        hideBody();
        navigateToLogin()
    }

    $( '#closeAlertDialogButton' ).click(function() {
        hideAlertDialog();
    });
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
    setInterval(function () {
        getVehiclePositions(adminCookie.id);
    },constants.UPDATE_TIME_INTERVAL);
    listenAdminSocketMethods();
}

function getVehiclePositions(adminId) {
    var data = {
        adminId : adminId
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
    var newOnlineVehiclesArray = responseData.vehiclesData;

    newOnlineVehiclesArray.forEach(function (vehicle, index) {
        var currentOnlineVehicle = getVehicleById(vehicle._id);
        if (currentOnlineVehicle !== false){
            currentOnlineVehicle.updateStatus(vehicle.onlineStatus);
            currentOnlineVehicle.updatePosition(vehicle.latitude, vehicle.longitude);
        }else{
            var newVehicle = createOnlineVehicle(vehicle._id, vehicle.latitude, vehicle.longitude,gMap, constants.ONLINE_STATUS);
            newVehicle.showMarker();
            addOnlineVehicle(newVehicle);
        }
    });
    updateLocalVehicles(newOnlineVehiclesArray);
}

function getVehicleById(id) {
    var response = false;
    onlineVehicles.forEach(function (vehicle, index) {
        if (vehicle.getId() === id){
            response = vehicle;
        }
    });
    return response;
}

function updateLocalVehicles(onlineVehicleArray){
    onlineVehicles.forEach(function (vehicle, index) {
        var inArray = isVehicleInServerArray(onlineVehicleArray, vehicle.getId());
        if (!inArray) {
            deleteOnlineVehicle(vehicle.getId());
        }
    });
}

function isVehicleInServerArray(vehicleArray, vehicleId) {
    var isExecuted = false;
    vehicleArray.forEach(function (vehicle, index) {
        if (vehicle._id === vehicleId) {
            isExecuted = true;
        }
    });
    return isExecuted;
}
//--------------------------------------------------------------------------------------------------

// Vehicle Simulation
//--------------------------------------------------------------------------------------------------
function initVehicleSimulation() {

    var updateInterval = 2000;

    setInterval(function () {

        var vehicleId = '58d403b94add1048224ea006';
        var currentLatLong = getCurrentLatLonPosition();
        updatePosition(vehicleId,currentLatLong.latitude,currentLatLong.longitude);

        var vehicleId = '58d407e3e9d9894b29dd64cc';
        var currentLatLong = getCurrentLatLonPosition();
        updatePosition(vehicleId,currentLatLong.latitude,currentLatLong.longitude);

        var vehicleId = '58d407e3e9d9894b29dd64cc';
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
    onlineVehicles.forEach(function (onlineVehicle, index) {
        if (onlineVehicle.getId() === id){
            onlineVehicle.hideMarker();
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

function createOnlineVehicle(id, latitude, longitude, gMap, status) {
    var myLatlng = new google.maps.LatLng(latitude,longitude);
    var onlineVehicle = {
        id          : id,
        latitude    : latitude,
        longitude   : longitude,
        latlong     : myLatlng,
        marker      : createMarker(myLatlng, id),
        gMap        : gMap,
        status      : status,
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
        updateStatus : function (onlineStatus) {
            if(onlineStatus === constants.ONLINE_STATUS) {
                if (this.marker !== null) {
                    this.marker.setIcon(constants.ONLINE_MARKER_ICON);
                }
            }else if(onlineStatus === constants.OFFLINE_STATUS){
                if (this.marker !== null){
                    this.marker.setIcon(constants.OFFLINE_MARKER_ICON);
                }
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

function createMarker(position, vehicleId) {
    var marker = new google.maps.Marker({
        position: position,
        title   : vehicleId,
        icon    : constants.ONLINE_MARKER_ICON
    });
    marker.addListener('click', function() {
        gMap.setZoom(17);
        gMap.setCenter(marker.getPosition());
        showVehicleData(vehicleId);
    });
    return marker;
}

//--------------------------------------------------------------------------------------------------

function showVehicleData(vehicleId){
    showProgressBar();
    getVehicleData(vehicleId, function (data, error) {
        hideProgressBar();
        if (data !== null){
            onGetVehicleDataSuccess(data)
        }else{
            onGetVehicleDataFailure(error);
        }
    });
}

function getVehicleData(vehicleId, callback) {
    var url_conn = constants.URL_SERVER + constants.VEHICLE_DATA + vehicleId;
    $.ajax({
        type        : 'GET',
        url         : url_conn,
        dataType    : 'json',
        contentType : 'application/json',
        success: function (data, textStatus, jqXHR) {
            if (data.status === constants.OK_STATUS){
                callback(data, null);
            }else{
                callback(null, "Error de Servidor");
            }
        },
        error: function (jqXHR, textStatus, errorThrown){
            console.log(jqXHR, textStatus, errorThrown);
            callback(null, "Error: "+errorThrown);
        }
    });
}

function onGetVehicleDataSuccess(data) {
    var vehicleData = data.data;
    onlineVehicles.forEach(function (onlineVehicle,index) {
        if (onlineVehicle.getId() === vehicleData._id){
            getAddressByLatLong(onlineVehicle.latitude, onlineVehicle.longitude, function (address, err) {
                var googleAddress;
                if (address !== null){
                    googleAddress = address;
                }else{
                    googleAddress = 'Dirección no encontrada.';
                }
                showVehicleDataModal(vehicleData.name, vehicleData.description, googleAddress);
            });
        }
    });
}

function onGetVehicleDataFailure(errorMessage) {
    showMessage("Error obteniendo información: "+errorMessage);
}

function showVehicleDataModal(vehicleName, vehicleDescription, vehicleAddress){
    setVehicleName(vehicleName);
    setVehicleDescription(vehicleDescription);
    setVehicleAddress(vehicleAddress);

    hideProgressBar();
    showVehicleModal();
}

//--------------------------------------------------------------------------------------------------

// Cookie Functions
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
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function getAdminCookie() {
    var response = null;
    if (checkCookie(constants.ADMIN_COOKIE_NAME)){
        response = JSON.parse(getCookie(constants.ADMIN_COOKIE_NAME));
    }
    return response;
}

function deleteCookie(cname) {
    document.cookie = cname + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

//--------------------------------------------------------------------------------------------------

// Other Functions
//--------------------------------------------------------------------------------------------------

function randomInRange(min, max) {
    return Math.random() < 0.5 ? ((1-Math.random()) * (max-min) + min) : (Math.random() * (max-min) + min);
}

function getAddressByLatLong(latitude, longitude, callback){
    var url_conn = 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+latitude+','+longitude+'&sensor=true&key=AIzaSyAgodg-yNFr9DyDab2a8sNWoKpKzQ5JUFI';
    $.ajax({
        url: url_conn,
        success: function(data){
            callback(data.results[0].formatted_address);
        },
        error: function(){
            callback(null);
        }
    });
}
//--------------------------------------------------------------------------------------------------

