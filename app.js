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
    console.log(req.params);

    ColabObject.findById(req.params.id, (err, object) => {
        if(err) {
            return res.status(500).json({
                title: 'An error occured',
                error: err
            });
        }

        console.log(req.params);

        console.log("Attempting to delete object " + req.params.id);

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

            // Since there was no error we can now let all the other users know a new object has been created.
            io.emit('data', {event:'del-object', data:object});

            res.status(200).json({
                message: 'Removed object',
                obj: result
            });
        });
    });
});

app.patch('/', (req, res, next) => {
    console.log("Recieved request to patch: " + req.body.objectId + " to " + req.body.content);

    ColabObject.findByIdAndUpdate(req.body.objectId, {content: req.body.content}, {new: true}, (err, new_object) => {
        if(err) {
            console.log(err);
            return res.status(500).json({
                title: 'An error occured',
                error: err
            });
        }

        if(!new_object) {
            return res.status(500).json({
                title: 'Object not found',
                error: {message: 'Object not found'}
            });
        }

        io.emit('data', {event:'update-object', data:new_object});

        res.status(200).json({
            message: 'Removed object',
            obj: new_object 
        });
    });
});


app.get('/lock/:id', (req, res, next) => {
    console.log('Locking: ' + req.params.id);

    ColabObject.findOneAndUpdate({_id: req.params.id, in_use: false}, {$set:{in_use: true}}, {new:true}, (err, doc, result) => {
        if(err) {
            console.log(err);
            return res.status(500).json({
                title: 'An error occured',
                error: err
            });
        }

        if(!doc) {
            return res.status(409).json({
                title: 'Object not locked',
                error: err
            });
        }

        // If we have made it here no doubt it was a big success so we emit to all users that the object is now locked.
        io.emit('data', {event:'lock-object', data:{id:doc._id}});

        res.status(201).json({
            message: 'Object locked',
            obj: result 
        });
    });
});


app.get('/unlock/:id', (req, res, next) => {
    console.log('Unlocking: ' + req.params.id);

    ColabObject.findOneAndUpdate({_id: req.params.id}, {$set:{in_use: false}}, {new:true}, (err, doc, result) => {
        if(err) {
            console.log(err);
            return res.status(500).json({
                title: 'An error occured',
                error: err
            });
        }

        if(!doc) {
            return res.status(409).json({
                title: 'Object not unlocked',
                error: err
            });
        }

        // If we have made it here no doubt it was a big success so we emit to all users that the object is now locked.
        io.emit('data', {event:'unlock-object', data:{id:doc._id}});

        res.status(201).json({
            message: 'Object unlocked',
            obj: result 
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