const express = require('express')
const cors = require('cors')
const path = require('path');
const axios  = require('axios');
const fs = require('fs');
var app = express()
var port = process.env.PORT | 3000
var http = require('http').Server(app);
const io = require('socket.io')(http);
const logger = require('./logger');
app.use(cors())
app.use(express.json())
app.use('/berkeley', require('./berkeley'))
app.use(express.static(path.join(__dirname,'public')))
const coordinatorIP=process.env.COORDINATOR||'http://localhost:5000/'
// edit time from user
app.post('/time', (req, res)=>{
    let newDate = req.body.time.split(':'); 
    clock.setMinutes(newDate[1])
    clock.setHours(newDate[0])
    clock.setSeconds(0);
    res.sendStatus(200)
})
logger.info('http://192.168.0.77 diferencia: 53')
app.post('/info',(req,res)=>{
    logger.info(req.body.txt)
    res.sendStatus(200)
})

app.get('/test',(req,res)=>{
    res.sendStatus(200)
})

setInterval(()=>{
    let a=fs.readFileSync(path.join(__dirname,'/logs/information.log'),(err,data)=>{
        return data
    })
    io.sockets.emit('log',a.toString())
},10000)

io.sockets.on('connection', (socket) => {
    console.log('A new user connected');
    setInterval(() => {
        socket.emit('hours', `${clock.toLocaleTimeString()}`);
    }, 1000);
});

http.listen(port, () => {
    console.log('Client listening on port ', port);
});