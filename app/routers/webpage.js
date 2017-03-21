module.exports = function(express,path){

    var app = express.Router();
    var main_route = __dirname + '/../../public/web/';

    app.get('/', function(req, res) {
        var html_route = path.join(main_route + 'home.html');
        res.sendFile(html_route);
    });

    app.get('/home', function(req, res) {
        var html_route = path.join(main_route + 'home.html');
        res.sendFile(html_route);
    });

    app.get('/about', function(req, res) {
        var html_route = path.join(main_route + 'about.html');
        res.sendFile(html_route);
    });

    app.get('/login', function(req, res) {
        var html_route = path.join(main_route + 'login.html');
        res.sendFile(html_route);
    });

    app.get('/main', function(req, res) {
        var html_route = path.join(main_route + 'main.html');
        res.sendFile(html_route);
    });

    return app;
};