//=======[ Settings, Imports & Data ]==========================================

var PORT    = 3000;

var express = require('express');
var app     = express();
var utils   = require('./mysql-connector');

// Ejercicio 3
let devices = require('./devices.json');

// to parse application/json
app.use(express.json()); 
// to serve static files
app.use(express.static('/home/node/app/static/'));

//=======[ Main module code ]==================================================

// Ejercicio 4
app.get('/devices/', function(req, res, next) {
    res.json(devices).status(200);
});

// Ejercicio 5
app.get('/devices/:id', function(req, res, next) {
    const id = req.params.id;
    const device = getDeviceById(id);
    if (!!device) {
        res.json(device).status(200);
    } else {
        res.send(`No se encontró ningún dispositivo con id:${id}`).status(204);
    }
});

// Ejercicio 6
app.post('/devices/', function(req, res, next) {
    const {id, state} = req.body;
    const device = getDeviceById(id);
    if (!!device) {
        device.state = state;
        console.log(state, device)
    }
    res.send(`Cambio realizado: ${JSON.stringify(device)}`);
});

app.listen(PORT, function(req, res) {
    console.log("NodeJS API running correctly");
});

function getDeviceById(id) {
    return devices.find(device => Number(id) === device.id);
}

//=======[ End of file ]=======================================================
