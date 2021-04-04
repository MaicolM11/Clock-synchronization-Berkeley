const express = require('express')
const cors = require('cors');
const shell = require('shelljs');
const logger = require('./logger')
const fs = require('fs')
const path = require('path');
const axios = require('axios');
const berkeley = require('./berkeley')
const m = require('./monitor');

var app = express()
var http = require('http').createServer(app);
const io = require('socket.io')(http);

var port = 5000
var portDocker = 4000;
var path_instances = './instances.json';

var getInstances = () => JSON.parse(fs.readFileSync(path_instances, { encoding: "utf-8" }).toString());

app.use(cors())
app.use(express.json())
app.use('/berkeley', berkeley.route)
app.use(express.static(path.join(__dirname, 'public')))

io.sockets.on('connection', (socket) => {
    setInterval(() => {
        let a = fs.readFileSync(path.join(__dirname, '/logs/information.log'))
        socket.emit('hours', `${global.clock.toLocaleTimeString()}`);
        socket.emit('servers-data2', global.servers);
        socket.emit('log', a.toString())
    }, 1000);
});

async function monitoring() {
    var values = await getInstances()
    for (let i = 0; i < values.length; i++) {
        let server = values[i].server
        let state = await axios.get(`${server}/test`).then(() => true).catch(() => false)
        values[i].state = state
    }
    fs.writeFileSync(path_instances, JSON.stringify(values));
}

//metodo post para crear instancia
app.post('/new_server', (req, res) => {
    try {
        portDocker++;
        shell.exec(`sh new_server.sh ${portDocker}`)
        var values = getInstances()
        values.push({ server: `http://127.0.0.1:${portDocker}`, state: true })
        fs.writeFileSync(path_instances, JSON.stringify(values));
        logger.info('New server has been added on port ' + portDocker);
        res.sendStatus(200);
    } catch { res.sendStatus(500) }
})

http.listen(port, () => {

    console.log(`listening on port: ${port}`);
});