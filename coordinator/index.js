const express = require('express')
const io = require('socket.io')(http);
const cors = require('cors')

var app = express()
var port = 5000
var http = require('http').createServer(app);

app.use(cors())
app.use(express.json())
app.use('/berkeley', require('./berkeley'))

io.on('connection', (socket) => {
    console.log('A new user connected');
});

//hora del coordinador e intancias conectadas ws

//metodo post para crear instancia

http.listen(port, () => {
    console.log('listening on *:3000');
});