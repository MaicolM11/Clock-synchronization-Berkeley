const io = require("socket.io-client");
const fs = require('fs')

var getInstances = () => JSON.parse(fs.readFileSync('./instances.json', { encoding: "utf-8" }).toString());

// {  'http://127.0.0.1:3000': '8:21:08 p. m.',  'http://127.0.0.1:3001': false  }
global.servers = {}

var servers = getInstances()

servers.forEach(server => {
    addServer(server)
});

function addServer(url_server){
    var socket = io(url_server).connect();
    global.servers[url_server] = ''
    socket.on('hours', data => global.servers[url_server] = data)
    socket.on('disconnect', () => global.servers[url_server] = '');
}

module.exports = addServer