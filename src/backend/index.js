//=======[ Settings, Imports & Data ]==========================================

const PORT = 3000;

const express = require('express');
const app = express();
// const utils = require('./mysql-connector');

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

let devices = require('./devices.json');
const devicesPath = path.join(__dirname, 'devices.json');

// to parse application/json
app.use(express.json());
// to serve static files
app.use(express.static('/home/node/app/static/'));

//=======[ Main module code ]==================================================

app.get('/devices/', function (req, res, next) {
  res.status(200).json(devices);
});

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

app.put('/devices/:id', function (req, res, next) {
  const id = req.params.id;
  const deviceIndex = getDeviceIndexById(id);

  if (deviceIndex > -1) {
    devices[deviceIndex] = {
      ...devices[deviceIndex],
      ...req.body,
    };
    // writeToFile(devices, devicesPath);
    res.status(200).send({ message: `Se realizó el cambio correctamente` });
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
    res.status(400).json({ message: 'Falta un parámetro en la consulta' });
  }

  const id = getNewId();
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
    // writeToFile(devices, devicesPath);
    res
      .status(200)
      .send({ message: `Se eliminó el dispositivo ${device[0].name}` });
  } else {
    res
      .status(404)
      .send({ message: `No se encontró un dispositivo con id:${id}` });
  }
});

app.listen(PORT, function (req, res) {
  console.log('NodeJS API running correctly');
});

function getDeviceIndexById(id) {
  return devices.findIndex((device) => id === device.id);
}

function writeToFile(file, path) {
  const fileStringified = JSON.stringify(file);
  fs.writeFile(path, fileStringified, (err) => {
    if (err) {
      console.log(err);
    }
  });
}

function isDefined(item) {
  if (item === undefined) {
    return false;
  }
  return true;
}

function getNewId() {
  return uuidv4();
}

//=======[ End of file ]=======================================================
