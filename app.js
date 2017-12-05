var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// Create the app and what not.
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
    next();
});

mongoose.connect('localhost:27017/db');
// Setup the http server and the web socket server.
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', (req, res, next) => {
    console.log("Returning index...");
    return res.render('index');
});

io.on('connection', function(socket){
    console.log('User ' + socket.handshake.address + ' connected...');
    console.log(io.engine.clientsCount +  " total clients.");
    io.emit('user-joined', 'A user joined the session...');

    socket.on('disconnect', () => {
        console.log('User ' + socket.handshake.address + ' disconnected...');
        console.log(io.engine.clientsCount +  " total clients.");
        io.emit('user-left', 'A user left the session...');
    });
});

http.listen(3000, function() {
    console.log("Listening on port 3000");
});