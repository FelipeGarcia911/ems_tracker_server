$( document ).ready(function() {

    $( "#navHome" ).click(function() {
        onNavHomeButtonClick();
    });

    $( "#navTrackingApp" ).click(function() {
        onNavTrackingAppButtonClick();
    });

    $( "#navAbout" ).click(function() {
        onNavAboutButtonClick();
    });

});

function onNavHomeButtonClick() {
    window.location.href = 'home';
}

function onNavTrackingAppButtonClick() {
    window.location.href = 'loginTrackingApp';
}

function onNavAboutButtonClick() {
    window.location.href = 'about';
}