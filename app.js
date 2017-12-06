var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var ColabObject = require('./data_models/object');

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

mongoose.connect('localhost:27017/colaborator_db');
// Setup the http server and the web socket server.
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.post('/create_obj', (req, res, next) => {
    console.log("Object created.");

    var object = new ColabObject({
        content: req.body.content,
        in_use: false,
    });

    object.save((err, result) => {
        if(err) {
            return res.status(500).json({
                title: 'An error occured',
                error: err
            });
        }

        // Since there was no error we can now let all the other users know a new object has been created.
        io.emit('data', {event:'new-object', data:object});

        res.status(201).json({
            message: 'Saved object',
            obj: result
        });
    });
});

app.delete('/:id', (req, res, next) => {
    ColabObject.findById(req.params.id, (err, object) => {
        if(err) {
            return res.status(500).json({
                title: 'An error occured',
                error: err
            });
        }

        if(!object) {
            return res.status(500).json({
                title: 'Object not found',
                error: {message: 'Object not found'}
            });
        }

        object.remove((err, result) => {
            if(err) {
                return res.status(500).json({
                    title: 'An error occured',
                    error: err
                });
            }

            res.status(200).json({
                message: 'Removed object',
                obj: result
            });
        });
    });
});

io.on('connection', function(socket){
    console.log('User ' + socket.handshake.address + ' connected...');
    console.log(io.engine.clientsCount +  " total clients.");
    socket.broadcast.emit('user-joined', 'A user joined the session...')

    ColabObject.find()
        .exec((err, objects) =>{
            if(err) {

            }

            socket.emit('data', {event:'whole-document', data:objects});
        });

    socket.sen

    socket.on('disconnect', () => {
        console.log('User ' + socket.handshake.address + ' disconnected...');
        console.log(io.engine.clientsCount +  " total clients.");
        io.emit('user-left', 'A user left the session...');
    });
});

// This route needs to be last since it is the catch all.
app.get('/', (req, res, next) => {
    console.log("Returning index...");
    return res.render('index');
});

http.listen(3000, function() {
    console.log("Listening on port 3000");
});