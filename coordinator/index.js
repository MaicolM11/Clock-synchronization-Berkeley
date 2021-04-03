const express = require('express')
const cors = require('cors');
const shell = require('shelljs');
const fs = require('fs')
const path = require('path');
const axios = require('axios');
const berkeley = require('./berkeley')

var app = express()
var http = require('http').createServer(app);
const io = require('socket.io')(http);

var port = 5000
let portDocker = 4000;

app.use(cors())
app.use(express.json())
app.use('/berkeley', berkeley.route)
app.use(express.static(path.join(__dirname, 'public')))

io.sockets.on('connection', (socket) => {
    setInterval(() => {
        socket.emit('hours', `${global.clock.toLocaleTimeString()}`);
        sockets.emit('servers-data', monitoring());
    }, 1000);
});

function monitoring() {
    var monitoring = []
    var urls = berkeley.getUrls()
    for (let i = 0; i < urls.length; i++) {
        let server = urls[i]
        let state = axios.get(`${server}/test`)
            .then(() => true)
            .catch(() => false)
        monitoring.push({ server: server, state: await state })
    }
    return monitoring;
}


//metodo post para crear instancia
app.post('/new_server', (req, res) => {
    console.log('llego')
    try {
        portDocker++;
        shell.exec(`sh new_server.sh ${portDocker}`)
        fs.appendFile('./urls.txt', `http://127.0.0.1:${portDocker}\n`, (err) => {
            if (err) throw err;
            console.log('new server has been added!');
            res.sendStatus(200);
        });
    } catch { res.sendStatus(500) }
})

http.listen(port, () => {
    console.log(`listening on port: ${port}`);
});