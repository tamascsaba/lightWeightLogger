/**
 * LeigtWeigt Main Files
 */

var express = require('express'),
    fs = require('fs'),
    http = require('http'),
    passport = require('passport');

// Konfiguráció betöltése
var env = process.env.NODE_ENV || 'development',
    config = require('./config/config')[env],
    auth = require('./config/middlewares/authorization'),
    mongoose = require('mongoose');

// Mongoose adatbázis kapcsolodás
mongoose.connect(config.db);

// Express beállítások
var app = express(),
    server = http.createServer(app),
    io = require('socket.io').listen(server);
require('./config/express')(app, config, passport);

// Modellek beolvasása
var models_path = __dirname + '/app/models';
fs.readdirSync(models_path).forEach(function (file) {
  require(models_path+'/'+file)(io);
});

// Autentikáció inicializálása
require('./config/passport')(passport, config);

// Routing inicializálás
require('./config/routes')(app, passport, auth);

// App indítása....
var port = process.env.PORT || 3000;
server.listen(port);
console.log('LightWeight Baby on port '+port);
