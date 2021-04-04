const io = require("socket.io-client");
const fs = require('fs')

var getInstances = () => JSON.parse(fs.readFileSync('./instances.json', { encoding: "utf-8" }).toString());

// {  'http://127.0.0.1:3000': '8:21:08 p. m.',  'http://127.0.0.1:3001': false  }
global.servers = {}

var servers = getInstances()

servers.forEach(element => {
    addServer(element.server)
});

function addServer(url_server){
    var socket = io(url_server).connect();
    servers[url_server] = false
    socket.on('hours', data => servers[url_server] = data)
    socket.on('disconnect', () => servers[url_server] = false);
}

module.exports = addServer