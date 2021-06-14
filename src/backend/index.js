//=======[ Settings, Imports & Data ]==========================================

var PORT    = 3000;

var express = require('express');
var app     = express();
var utils   = require('./mysql-connector');
let devices = require('./devices.json');

// to parse application/json
app.use(express.json()); 
// to serve static files
app.use(express.static('/home/node/app/static/'));

//=======[ Main module code ]==================================================

app.get('/devices/', function(req, res, next) {
    res.json(devices).status(200);
});

app.get('/devices/:id', function(req, res, next) {
    const id = req.params.id;
    const device = devices.find(device => {
        return id === device.id ? device : null;
    })
    if (!device) {
        res.json(device).status(200);
    } else {
        res.send(`No se encontró ningún dispositivo con id:${id}`).status(204);
    }
});

app.post('/devices/', function(req, res, next) {

    res.send(`Cambio realizado`);
    
});

app.listen(PORT, function(req, res) {
    console.log("NodeJS API running correctly");
});

//=======[ End of file ]=======================================================
