var ADMIN_COOKIE_DAYS = 15;
var ADMIN_COOKIE_SEG  = 30;

var constants = {
    ADMIN_COOKIE_NAME           : 'adminCookie',
    ADMIN_COOKIE_REMEMBER_TIME  : (ADMIN_COOKIE_DAYS * 24 * 60 * 60 * 1000),
    ADMIN_COOKIE_TEMP_TIME      : (ADMIN_COOKIE_SEG * 1000),

    URL_SERVER                  : 'http://localhost:3000/api/',

    // Api Methods
    LOGIN_ADMIN     : 'admin/login/',

    // Connection Status
    SUCCESS_STATUS : 200,
    FAILURE_STATUS : 500,
};

$( document ).ready(function() {

    onDocumentReady();

    $( '#loginButton' ).click(function() {
        onLoginAction();
    });

    $('#passwordInput').keyup(function(e){
        if(e.keyCode == 13) {
            onLoginAction();
        }
    });

    $( '#closeAlertDialogButton' ).click(function() {
        hideAlertDialog();
    });

});

// View Functions
//------------------------------------------------------------------------------------------------------------------
function getUserName() {
    return $( '#userInput' ).val();
}

function getUserPassword() {
    return $( '#passwordInput' ).val();
}

function getRememberMe() {
    return $( '#rememberCheckBox' ).is(":checked")
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

function showProgressBar() {
    $('#progressBar').show();
}

function hideProgressBar() {
    $('#progressBar').hide();
}

function showBody() {
    $('body').show();
}

function hideBody() {
    $('body').hide();
}
//------------------------------------------------------------------------------------------------------------------

//Presenter Functions
//----------------------------------------------------------------------------------------------------------------------
function onDocumentReady() {
    deleteCookie(constants.ADMIN_COOKIE_NAME);
    if(checkUserAuth()){
        hideBody();
        navigateToWebApp();
    }else{
        showBody();
    }
}

function checkUserAuth() {
    return checkCookie(constants.ADMIN_COOKIE_NAME);
}

function onLoginAction() {
    var username = getUserName();
    var password = getUserPassword();
    var rememberMe = getRememberMe();
    console.log(rememberMe);

    if ( isValidString(username) && isValidString(password)){
        hideAlertDialog();
        showProgressBar();
        doLogin(username, password, rememberMe);
    }else{
        showMessage('Usuario o contraseña inválida.');
    }
}

function navigateToWebApp() {
    window.location.href = 'mainTrackingApp';
}

function onSuccessLogin() {
    navigateToWebApp();
}

function onFailureLogin(errorMessage) {
    hideProgressBar();
    showMessage(errorMessage);
}
//----------------------------------------------------------------------------------------------------------------------


// Repository Functions
//----------------------------------------------------------------------------------------------------------------------
function doLogin(username, password, rememberMe) {
    var url_conn = constants.URL_SERVER + constants.LOGIN_ADMIN;
    var dataToSend = createJSONLoginRequest(username, password);
    $.ajax({
        type        : 'POST',
        url         : url_conn,
        data        : dataToSend,
        dataType    : 'json',
        contentType : 'application/json',
        success: function (data, textStatus, jqXHR) {
            onLoginSuccessResponse(data, rememberMe);
        },
        error: function (jqXHR, textStatus, errorThrown){
            onLoginFailureResponse(errorThrown);
        }
    });
}

function onLoginSuccessResponse(data, rememberMe) {
    var status = data.status;
    if (status === constants.SUCCESS_STATUS){
        var adminData = data.data;
        if (rememberMe){
            saveAdminCookie(adminData);
        }else{
            saveTempCookie(adminData);
        }
        onSuccessLogin();
    }else if (status === constants.FAILURE_STATUS){
        var errorMessage = data.message;
        onFailureLogin(errorMessage);
    }else{
        onFailureLogin('Error desconocido, intentelo de nuevo.');
    }
}

function onLoginFailureResponse(errorThrown) {
    onFailureLogin('Error desconocido: '+errorThrown);
}

function createJSONLoginRequest(username, password){
    var response = {
        user        : username,
        password    : password,
    };
    return JSON.stringify(response);
}
//----------------------------------------------------------------------------------------------------------------------

//Cookie Functions
//----------------------------------------------------------------------------------------------------------------------
function saveAdminCookie(adminData) {
    var adminId = adminData._id;
    var adminToken = adminData._id;
    var adminCookie = createJSONToAdminCookie(adminId, adminToken);
    setCookie(constants.ADMIN_COOKIE_NAME, adminCookie, constants.ADMIN_COOKIE_REMEMBER_TIME);
}

function saveTempCookie(adminData) {
    var adminId = adminData._id;
    var adminToken = adminData._id;
    var adminCookie = createJSONToAdminCookie(adminId, adminToken);
    setCookie(constants.ADMIN_COOKIE_NAME, adminCookie, constants.ADMIN_COOKIE_TEMP_TIME);
}

function createJSONToAdminCookie(adminId, adminToken) {
    var adminCookie = {
        id : adminId,
        token : adminToken
    };
    return JSON.stringify(adminCookie);
}

function setCookie(cname, cvalue, time) {
    var d = new Date();
    d.setTime(d.getTime() + time);
    var expires = 'expires='+d.toUTCString();
    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
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

function checkCookie(cname) {
    var cookie = getCookie(cname);
    return cookie !== "";
}

function deleteCookie(cname) {
    document.cookie = cname + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

//----------------------------------------------------------------------------------------------------------------------
// Other Functions
//----------------------------------------------------------------------------------------------------------------------
function isValidString(string) {
    return string !== null && string !== '';
}
//----------------------------------------------------------------------------------------------------------------------


