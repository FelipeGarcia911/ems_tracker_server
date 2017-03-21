
var socket;

var adminTokenString = 'AASSDW#$F#RC#$V#CER';
var getAllVehiclePositionsInterval;

//Init Script Functions
initScript();

// Inicialización de GoogleMaps
function initGoogleMap() {
    var mapProp = {
        center : new google.maps.LatLng(51.508742,-0.120850),
        zoom : 10
    };
    var map = new google.maps.Map(document.getElementById("googleMap"),mapProp);
}

// -------------------------------------------------------------------------------------
function initScript(){
    initSocketConnection();
}

function initSocketConnection(){
    socket = io();
    socket.on('new_message', function(msg){
        alert(msg);
    });
}
// -------------------------------------------------------------------------------------
