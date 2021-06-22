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

// Endpoint: /devices
// Retorna json de dispositivos
app.get('/devices/', function (req, res, next) {
  res.status(200).json(devices);
});

// Endpoint: /devices/:id
// id - el ID del dispositivo
// Retorna el json de un dispositivo
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

// Endpoint: /devices/:id
// id - el ID del dispositivo
// Actualiza el dispositivo
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

// Endpoint: /devices/create
// Crea un nuevo dispositivo
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

// Endpoint: /devices/:id
// id - el ID del dispositivo
// Elimina un dispositivo
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

// id - id del dispositivo que se busca
// Retorna el indice del dispositivo
function getDeviceIndexById(id) {
  return devices.findIndex((device) => id === device.id);
}

// file - el archivo a escribir
// path - la direccion del archivo a escribir
// Escribe/Sobreescribe un archivo
function writeToFile(file, path) {
  const fileStringified = JSON.stringify(file);
  fs.writeFile(path, fileStringified, (err) => {
    if (err) {
      console.log(err);
    }
  });
}

// item - elemento a comparar
// Devuelve verdadero si el item esta definido, sino devuelve falso.
function isDefined(item) {
  if (item === undefined) {
    return false;
  }
  return true;
}

// Devuelve un ID unico
function getNewId() {
  return uuidv4();
}

//=======[ End of file ]=======================================================
