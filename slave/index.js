const express = require('express')
const io = require('socket.io')(http);
const cors = require('cors')

var app = express()
var port = 3000
var http = require('http').createServer(app);

var clock = new Date('2021-01-01T00:00:00.00')

setInterval(()=>{
    clock.setMilliseconds(clock.getMilliseconds()+1000)
    console.log(clock)
},1000)

var getHourSeconds = (date) => (parseInt(date.hour) * 3600) + (parseInt(date.minutes) * 60) + parseInt(date.seconds);

app.use(cors())
app.use(express.json())

// obtener diferencia con la hora que llega por parametro
// http://localhost:3000/difference?hour=8&minutes=30&seconds=10
app.get('/difference', (req, res) => {
    let myDate = { hour: clock.getHours(), minutes: clock.getMinutes(), seconds: clock.getSeconds() }
    let diff = Math.abs(getHourSeconds(myDate) - getHourSeconds(req.query))
    res.send({ difference: diff })
})

app.post('/time', (req, res) => {
    clock.setTime(clock.getTime() + (req.body.seconds * 1000))
    res.sendStatus(200)
})

io.on('connection', (socket) => {
    console.log('A new user connected');
    setInterval(() => {
        socket.emit('hours', `${clock.getHours()}:${clock.getMinutes()}:${clock.getSeconds()}`);
    }, 1000);
});

http.listen(port, () => {
    console.log('listening on *:3000');
});