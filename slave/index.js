const express = require('express')
const cors = require('cors')
const path = require('path');
const fs = require('fs');

var app = express()
var port = process.env.PORT | 3000
var http = require('http').Server(app);
const io = require('socket.io')(http);
const logger = require('./logger');

app.use(cors())
app.use(express.json())
app.use('/berkeley', require('./berkeley'))
app.use(express.static(path.join(__dirname, 'public')))

// edit time from user
app.post('/time', (req, res) => {
    let newDate = req.body.time.split(':');
    let before_clock = new Date(clock.getTime())
    clock.setMinutes(newDate[1])
    clock.setHours(newDate[0])
    clock.setSeconds(0);
    logger.info(`[USER] The user has changed the time from ${before_clock.toLocaleTimeString()} to ${clock.toLocaleTimeString()}`)
    res.sendStatus(200)
})

app.get('/test', (req, res) => res.sendStatus(200))

io.sockets.on('connection', (socket) => {
    setInterval(() => {
        let a = fs.readFileSync(path.join(__dirname, '/logs/information.log'))
        socket.emit('hours', `${clock.toLocaleTimeString()}`);
        socket.emit('log', a.toString())
    }, 1000);
});

http.listen(port, () => {
    console.log('Client listening on port ', port);
});