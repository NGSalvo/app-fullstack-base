//=======[ Settings, Imports & Data ]==========================================

const PORT = 3000;

const express = require('express');
const app = express();
const utils = require('./mysql-connector');

// Ejercicio 3
let devices = require('./devices.json');

const fs = require('fs');
const path = require('path');

const devicesPath = path.join(__dirname, 'devices.json');

// to parse application/json
app.use(express.json());
// to serve static files
app.use(express.static('/home/node/app/static/'));

//=======[ Main module code ]==================================================

// Ejercicio 4
app.get('/devices/', function (req, res, next) {
  res.status(200).json(devices);
});

// Ejercicio 5
app.get('/devices/:id', function (req, res, next) {
  const id = req.params.id;
  const deviceIndex = getDeviceIndexById(id);
  if (deviceIndex > -1) {
    res.status(200).json(devices[deviceIndex]);
  } else {
    res
      .status(404)
      .send({ message: `No se encontró ningún dispositivo con id:${id}` });
  }
});

// Ejercicio 6
app.put('/devices/:id', function (req, res, next) {
  const id = req.params.id;
  const { name, description, state, type } = req.body;
  const deviceIndex = getDeviceIndexById(id);
  if (deviceIndex > -1) {
    devices[deviceIndex].state = state;
    writeToFile(devices, devicesPath);
    res
      .status(200)
      .send(`Cambio realizado: ${JSON.stringify(devices[deviceIndex])}`);
  } else {
    res
      .status(404)
      .send({ message: `No se encontró ningún dispositivo con id:${id}` });
  }
});

app.post('/devices/create', function (req, res, next) {
  const { name, description, state, type } = req.body;

  if (
    !isDefined(name) ||
    !isDefined(description) ||
    !isDefined(state) ||
    !isDefined(type)
  ) {
    return res
      .status(400)
      .json({ message: 'Falta un parámetro en la consulta' });
  }

  const id = devices.length + 1;
  const newDevice = {
    id,
    name,
    description,
    state,
    type,
  };
  devices.push(newDevice);
  // writeToFile(devices, devicesPath);
  res
    .status(201)
    .send({ message: 'Se creó el dispositivo satisfactoriamente' });
});

app.delete('/devices/:id', function (req, res, next) {
  const id = req.params.id;
  const deviceIndex = getDeviceIndexById(id);
  if (deviceIndex > -1) {
    const device = devices.splice(deviceIndex, 1);
    // devices = devices.filter(device => Number(deviceIndex) !== device.id);
    writeToFile(devices, devicesPath);
    res
      .status(200)
      .send({ message: `Se eliminó el dispositivo ${device[0].name}` });
  } else {
    res
      .status(404)
      .send({ message: `No se encontró ningún dispositivo con id:${id}` });
  }
});

app.listen(PORT, function (req, res) {
  console.log('NodeJS API running correctly');
});

function getDeviceById(id) {
  return devices.find((device) => Number(id) === device.id);
}

function getDeviceIndexById(id) {
  return devices.findIndex((device) => Number(id) === device.id);
}

function writeToFile(file, path) {
  const filestringified = JSON.stringify(file);
  fs.writeFileSync(path, filestringified);
}

function isDefined(item) {
  if (item === undefined) {
    return false;
  }
  return true;
}

//=======[ End of file ]=======================================================
