var express = require('express');
var router = express.Router();
var enableWs = require('express-ws');
var Object = require("../data_models/object")

// Enable the web-socket API.
enableWs(router);

router.get('/echo', function (req, res, next) {
    res.render('index');
});

router.ws('/echo', function(ws, req) {
    ws.on('message', function(msg){
        console.log("CONNECTED!");
        ws.send(msg);
    });
});



module.exports = router;
