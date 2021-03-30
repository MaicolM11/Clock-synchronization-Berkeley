const express = require('express')
const io = require('socket.io')(http);
const cors = require('cors')
const path = require('path');
var app = express()
var port = process.env.PORT | 3000
var http = require('http').createServer(app);

app.use(cors())
app.use(express.json())
app.use('/berkeley', require('./berkeley'))
app.use(express.static(path.join(__dirname,'public')))

// edit time from user
app.post('time', (req, res)=>{

})

io.on('connection', (socket) => {
    console.log('A new user connected');
    setInterval(() => {
        socket.emit('hours', `${clock.getHours()}:${clock.getMinutes()}:${clock.getSeconds()}`);
    }, 1000);
});

http.listen(port, () => {
    console.log('Client listening on port ', port);
});