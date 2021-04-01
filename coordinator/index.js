const express = require('express')
const io = require('socket.io')(http);
const cors = require('cors');
const shell = require('shelljs');
const fs = require('fs')

var app = express()
var port = 5000
var http = require('http').createServer(app);
let portDocker = 4000;

app.use(cors())
app.use(express.json())
app.use('/berkeley', require('./berkeley'))

io.on('connection', (socket) => {
    console.log('A new user connected');
});

//hora del coordinador e intancias conectadas ws

//metodo post para crear instancia
app.post('/new_server', (req, res) => {
    portDocker++;
    fs.appendFile('./urls.txt', `http://127.0.0.1:${portDocker}\n`, (err) => {
        if (err) throw err;
        console.log('new server has been added!');
      });
    shell.exec(`sh new_server.sh ${portDocker}`)
    //res.send(`sh new_server.sh ${portDocker}`);
    res.send('added').sendStatus(200);
})

app.post('/', (req, res) => {
    res.send('ok');
})

http.listen(port, () => {
    console.log('listening on *:3000');
});