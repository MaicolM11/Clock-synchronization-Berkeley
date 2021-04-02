const express = require('express')
const cors = require('cors')
const path = require('path');
var app = express()
var port = process.env.PORT | 3000
var http = require('http').Server(app);
const io = require('socket.io')(http);
app.use(cors())
app.use(express.json())
app.use('/berkeley', require('./berkeley'))
app.use(express.static(path.join(__dirname,'public')))

// edit time from user
app.post('/time', (req, res)=>{
    let newDate = req.body.time.split(':'); 
    clock.setMinutes(newDate[1])
    clock.setHours(newDate[0])
    clock.setSeconds(0);
    res.sendStatus(200)
})

io.sockets.on('connection', (socket) => {
    console.log('A new user connected');
    setInterval(() => {
        socket.emit('hours', `${clock.toLocaleTimeString()}`);
    }, 1000);
});

http.listen(port, () => {
    console.log('Client listening on port ', port);
});